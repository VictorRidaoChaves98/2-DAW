export async function askAI(prompt) {
    try {
        const response = await fetch("/api/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "Qwen3-4B-Instruct-2507-Q4_K_S.gguf",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "⚠️ La IA respondió vacío.";
    } catch (err) {
        return "❌ Error conectando con LM Studio: " + err.message;
    }
}
