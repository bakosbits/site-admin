import OpenAI from "openai";
import { PRICING_OPTIONS } from "@/lib/constants";

// --- Schema Definitions ---

// This is the base schema definition, used by both providers.
const getBaseSchema = (categoryNames) => ({
    "Name": {
        type: "STRING",
        description: "Required - The official name of the tool."
    },
    "Domain": {
        type: "STRING",
        description: "Required - The main domain of the tool's website (e.g., figma.com)."
    },
    "Website": {
        type: "STRING",
        description: "Required - The official website of the tool."
    },
    "Why": {
        type: "STRING",
        description: "Required - A concise single sentence explaining why someone should care about this tool."
    },
    "Description": {
        type: "STRING",
        description: "Required - A very short paragraph, 2 sentences, on why someone would use this tool."
    },
    "Details": {
        type: "STRING",
        description: "Required - A more in-depth paragraph about the tool's capabilities."
    },
    "Features": {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "Required - An array of 5 separate strings. Each string should be a distinct key feature as a short sentence."
    },
    "Cautions": {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "Required - An array of 3 separate strings. Each string should be a distinct caution as a short sentence."
    },
    "Buyer": {
        type: "STRING",
        description: "Required - A short paragraph about who would best benefit from purchasing this tool."
    },
    "Pricing": {
        type: "ARRAY",
        items: {
            type: "STRING",
            enum: PRICING_OPTIONS
        },
        description: "One or more of these predefined price models."
    },
    "Base_Model": { type: "STRING", description: "Required - Identify the underlying AI or Machine Learning technology. If it's a known LLM (like GPT-4), name it. If not, describe the type of AI used (e.g., 'Proprietary computer vision model', 'Diffusion model'). This field must not be empty." },
    "Tags": {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "An array of seperate strings, with each string being a tag for a tag cloud (3 to 7 cloud tags total)."
    },
    "Categories": {
        type: "ARRAY",
        items: {
            type: "STRING",
            enum: categoryNames,
        },
        description: "Select one or more professions the tool is designed for from the provided categoryNames list."
    }
});

// --- Schema Converters ---

// Converts the base schema to the format required by OpenAI/OpenRouter Tool Calling
const convertToOpenAITool = (baseSchema) => {
    const properties = {};
    const required = [];

    const typeMap = {
        "STRING": "string", "ARRAY": "array",
    };

    for (const [key, value] of Object.entries(baseSchema)) {
        properties[key] = {
            type: typeMap[value.type],
            description: value.description,
        };
        if (value.items) {
            properties[key].items = { type: typeMap[value.items.type] };
            // If the items within the array have an enum, it belongs on the items object.
            if (value.items.enum) {
                properties[key].items.enum = value.items.enum;
            }
        }
        // Handle enums for non-array types.
        if (value.enum) {
            properties[key].enum = value.enum || value.items.enum;
        }
        if (value.description && value.description.toLowerCase().startsWith("required")) {
            required.push(key);
        }
    }

    return {
        type: "function",
        function: {
            name: "format_tool_research",
            description: "Formats the research findings for the specified AI tool.",
            parameters: { type: "object", properties, required },
        },
    };
};

// --- Provider Implementations ---

async function generateWithOpenRouter(toolName, modelName, categoryNames) {
    const openRouter = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
            "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000", // Recommended for OpenRouter
            "X-Title": process.env.SITE_TITLE || "AI Tool Pouch Admin", // Recommended for OpenRouter
        },
    });
    const tool = convertToOpenAITool(getBaseSchema(categoryNames));
    const prompt = `You are an expert AI tool researcher. Research the tool named "${toolName}". Based on your research, identify the most relevant professional categories for this tool. Available Categories: ${categoryNames.join(', ')}. It is critical that all 'Required' fields in the schema are filled accurately and not left empty. Then, call the 'format_tool_research' function with the results.`;
    const response = await openRouter.chat.completions.create({
        model: modelName,
        // Use the more robust array format for content, which is required by some models like Gemini.
        messages: [
            {
                role: "user",
                content: [{ type: "text", text: prompt }],
            },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "format_tool_research" } },
    });
    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "format_tool_research") {
        throw new Error("OpenRouter did not return the expected tool call.");
    }
    return JSON.parse(toolCall.function.arguments);
}

// --- Main Exported Function ---

export async function generateToolResearch(toolName, modelName, categoryNames) {
    // Default to a fast and capable OpenRouter model if none is provided.
    const effectiveModel = modelName || "anthropic/claude-3-haiku:beta";
    return generateWithOpenRouter(toolName, effectiveModel, categoryNames);
}