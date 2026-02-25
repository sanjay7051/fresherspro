export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { content } = req.body;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "user",
                        content: `Enhance this resume professionally and return ONLY valid JSON:\n${JSON.stringify(content)}`
                    }
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content;

        if (!result) {
            return res.status(500).json({ error: "No AI response received" });
        }

        return res.status(200).json({
            result: JSON.parse(result)
        });

    } catch (error) {
        console.error("AI ERROR:", error);
        return res.status(500).json({ error: "AI failed" });
    }
}