import { parseToolForm } from "../../lib/form-helpers";
// You'll need a way to save the tool to your database.
// This is a placeholder for your actual database logic.
// import { saveToolToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Parse the incoming form data from the request.
        // This uses your existing helper function.
        const formData = await parseToolForm(req);
        const toolName = formData.Name; // Assuming your form has a 'Name' field for the tool.

        if (!toolName) {
            return res.status(400).json({ message: "Tool name is required from the form." });
        }

        // 2. Call your research API to get enriched data from Gemini.
        // The URL should point to your app. Use an environment variable for the domain.
        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        const researchResponse = await fetch(`${appUrl}/api/research`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ toolName }),
        });

        if (!researchResponse.ok) {
            const errorData = await researchResponse.json();
            // If research fails, you might want to still save the tool with partial data,
            // or return an error. Here, we return an error.
            console.error("Research API failed:", errorData.message);
            return res.status(502).json({ message: `Failed to research the tool: ${errorData.message}` });
        }

        const researchedData = await researchResponse.json();

        // 3. Merge the original form data with the data from Gemini.
        // Data from Gemini will overwrite form data if keys are the same (e.g., 'Name').
        const finalToolData = {
            ...formData,
            ...researchedData,
        };

        // 4. Save the final, combined data to your database (this part is conceptual).
        // await saveToolToDatabase(finalToolData);

        res.status(200).json({ message: "Tool created successfully!", tool: finalToolData });
    } catch (error) {
        console.error("Error creating tool:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
}