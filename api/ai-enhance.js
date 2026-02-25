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
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional resume writer."
                    },
                    {
                        role: "user",
                        content: `Enhance this resume data professionally:\n\n${JSON.stringify(content)}`
                    }
                ],
                temperature: 0.7
            }),
        });

        const data = await response.json();

        // SAFE extraction (prevents crash)
        const aiText =
            data?.choices?.[0]?.message?.content || "";

        if (!aiText) {
            return res.status(500).json({ error: "AI returned empty response", raw: data });
        }

        // Try to parse JSON safely
        let parsed;
        try {
            parsed = JSON.parse(aiText);
        } catch {
            // If AI didn't return JSON, send raw text
            return res.status(200).json({
                careerObjective: aiText
            });
        }

        return res.status(200).json(parsed);

    } catch (error) {
        console.error("AI ERROR:", error);
        return res.status(500).json({ error: error.message });
    }
}