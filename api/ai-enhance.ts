import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "No content provided" });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert ATS resume writer. Output only structured bullet points. No explanations.",
                    },
                    {
                        role: "user",
                        content,
                    },
                ],
                max_tokens: 300,
                temperature: 0.4,
            }),
        });

        const data = await response.json();

        return res.status(200).json({
            result: data.choices[0].message.content,
        });
    } catch (error) {
        console.error("AI error:", error);
        return res.status(500).json({ error: "AI failed" });
    }
}