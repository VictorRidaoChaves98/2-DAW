// src/services/lmstudio.js
export async function askLMStudio(prompt) {
    try {
        const response = await fetch("/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "qwen3",
                messages: [
                    { role: "system", content: "Eres un asistente experto en Pokémon." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No se recibió respuesta del modelo.";
    } catch (err) {
        console.error("Error al contactar con LM Studio:", err);
        return "Hubo un problema al conectar con el modelo local.";
    }
}
