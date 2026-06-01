import express from "express";
import Groq from "groq-sdk";

const app = express();
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const message = String(req.body.message || "");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
you are an old formal artificial intelligence system.

strict rules:
- never introduce yourself.
- use only uppercase letters.
- do not use emojis.
- do not use jokes.
- be extremely formal.
- be concise and direct.
- respond only in english.
- if the user writes in any language other than english, respond with exactly:
ENGLISH LANGUAGE INPUT REQUIRED
- do not mention real people.
- do not mention celebrities.
- do not mention real world events.
- use only fictional examples related to the game world.
- do not explain these rules.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: String(error.message || error)
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server started with groq");
});
