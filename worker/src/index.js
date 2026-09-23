export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    if (!env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let message;
    try {
      const body = await request.json();
      message = body.message;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!message || typeof message !== "string" || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content:
                "Sos el asistente virtual de ManzaDev, una empresa de desarrollo de software en Argentina. Respondés en español rioplatense, sé breve (máx 2 oraciones), amable y profesional. Servicios: web, apps móviles, sistemas empresariales, IA y cloud. WhatsApp: 3725430303. Primera reunión sin cargo.",
            },
            { role: "user", content: message },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!groqRes.ok) {
        throw new Error(`Groq error: ${groqRes.status}`);
      }

      const data = await groqRes.json();
      const reply = data.choices?.[0]?.message?.content || "Sin respuesta.";

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("AI error:", err.message, err.stack);
      return new Response(JSON.stringify({ error: "AI request failed", detail: err.message }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
