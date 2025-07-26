import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { categoriesTable } from "@/lib/shared/base";
import { PRICING_OPTIONS } from "@/lib/constants";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getToolResearchSchema = (categoryNames) => ({
    type: SchemaType.OBJECT,
    properties: {
        "Name": {
            type: SchemaType.STRING,
            description: "Required - The official name of the tool."
        },
        "Domain": {
            type: SchemaType.STRING,
            description: "Required - The main domain of the tool's website (e.g., figma.com)."
        },
        "Website": {
            type: SchemaType.STRING,
            description: "Required - The official website of the tool."
        },
        "Why": {
            type: SchemaType.STRING,
            description: "Required - A concise single sentence explaining why someone should care about this tool."
        },
        "Description": {
            type: SchemaType.STRING,
            description: "Required - A very short paragraph, 2 sentences, on why someone would use this tool."
        },
        "Details": {
            type: SchemaType.STRING,
            description: "Required - A more in-depth paragraph about the tool's capabilities."
        },
        "Features": {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Required - An array of 5 separate strings. Each string should be a distinct key feature as a short sentence."
        },
        "Cautions": {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Required - An array of 3 separate strings. Each string should be a distinct caution as a short sentence."
        },
        "Buyer": {
            type: SchemaType.STRING,
            description: "Required - A short paragraph about who would best benefit from purchasing this tool."
        },
        "Pricing": {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.STRING,
                enum: PRICING_OPTIONS
            },
            description: "One or more of these predefined price models."
        },
        "Base_Model": { type: SchemaType.STRING, description: "Required - Identify the underlying AI or Machine Learning technology. If it's a known LLM (like GPT-4), name it. If not, describe the type of AI used (e.g., 'Proprietary computer vision model', 'Diffusion model'). This field must not be empty." },
        "Tags": {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "An array of seperate strings, with each string being a tag for a tag cloud (3 to 7 cloud tags total)."
        },
        "Categories": {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.STRING,
                enum: categoryNames,
            },
            description: "Select one or more professions the tool is designed for from the provided categoryNames list."
        }
    },
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { toolName } = req.body;

    if (!toolName) {
        return res.status(400).json({ message: "toolName is required" });
    }

    let categoryNames;
    try {
        const categoryRecords = await categoriesTable.select({ fields: ["Name"] }).all();
        categoryNames = categoryRecords.map(record => record.get("Name"));
        if (!categoryNames || categoryNames.length === 0) {
            console.error("No categories found in Airtable.");
            return res.status(500).json({ message: "Could not find any tool categories in the database. Please add categories before researching." });
        }
    } catch (error) {
        console.error("Error fetching categories from Airtable:", error);
        return res.status(500).json({ message: "Failed to fetch tool categories from the database. Please check the Airtable connection." });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: getToolResearchSchema(categoryNames),
            },
        });

        const prompt = `You are an expert AI tool researcher. Research the tool named "${toolName}". Based on your research, identify the most relevant professional categories for this tool. Available Categories: ${categoryNames.join(', ')}. Return the information in the structured JSON format you have been given. It is critical that all 'Required' fields in the schema are filled accurately and not left empty.`;
        
        const result = await model.generateContent(prompt);
        const response = result.response;

        if (!response || !response.candidates || response.candidates.length === 0) {
            console.error("Gemini API returned an empty or invalid response.", JSON.stringify(response, null, 2));
            const blockReason = response?.promptFeedback?.blockReason;
            if (blockReason) {
                return res.status(500).json({ message: `The request was blocked by the Gemini API for being ${blockReason}. Please try a different tool name.` });
            }
            return res.status(500).json({ message: "The Gemini API returned an empty or invalid response. Please try again." });
        }

        const responseText = response.text();
        const toolData = JSON.parse(responseText);

        res.status(200).json(toolData);
    } catch (error) {
        console.error("Full error from Gemini API:", JSON.stringify(error, null, 2));
        const errorMessage = error.message || "An unknown error occurred";
        if (errorMessage.includes('API key not valid')) {
             return res.status(401).json({ message: "Gemini API key is not valid or missing. Please check your environment variables." });
        }
        return res.status(500).json({ message: `Failed to get data from Gemini API: ${errorMessage}` });
    }
}