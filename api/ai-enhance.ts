import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Missing resume content" });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: "OpenAI key missing" });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `
Enhance the following resume content professionally:

${JSON.stringify(content, null, 2)}

Return ONLY valid JSON with:
careerObjective,
experience,
projects,
programmingLanguages,
frameworksLibraries,
toolsPlatforms,
databases,
softSkills,
certifications
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        const result = completion.choices[0].message.content;

        return res.status(200).json({ result: JSON.parse(result || "{}") });

    } catch (error: any) {
        console.error("AI ERROR:", error);
        return res.status(500).json({
            error: error.message || "Internal Server Error",
        });
    }
}