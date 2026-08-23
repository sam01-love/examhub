import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "1mb" }));

  // Initialize Gemini API client lazily/safely if key is available
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Route for AI Explanation / Explanation of Questions
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const { question, options, correctAnswer, userSelectedAnswer, subject, examType } = req.body;

      if (!question) {
        return res.status(400).json({ error: "Question text is required." });
      }

      const ai = getAiClient();
      const prompt = `You are EXAMHUB's expert AI Tutor for Nigerian secondary school students preparing for ${examType || "JAMB/WAEC/OAU Post-UTME"}.
Subject: ${subject || "General"}
Question: ${question}
Options: ${JSON.stringify(options || [])}
Correct Answer Key: ${correctAnswer}
Student Selected Option: ${userSelectedAnswer || "None"}

Please provide a clear, step-by-step breakdown explaining:
1. Why the correct option (${correctAnswer}) is right.
2. Why other options are incorrect or common traps.
3. Relevant formulas, rules, or key memory tricks for this topic.
Keep the explanation engaging, accurate, and easy for a Nigerian high school student to understand. Format using clean Markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ explanation: response.text });
    } catch (error: any) {
      console.error("Error in /api/ai/explain:", error?.message || error);
      res.status(500).json({
        error: error?.message || "Failed to generate AI explanation.",
        fallbackExplanation:
          "AI Tutor is currently offline or missing API key. Please check the built-in step-by-step solution provided below.",
      });
    }
  });

  // API Route for AI Study Assistant (Ask anything about syllabus, topic or formula)
  app.post("/api/ai/tutor", async (req, res) => {
    try {
      const { prompt, subject, topic } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const ai = getAiClient();
      const systemInstruction = `You are EXAMHUB's AI Study Assistant specializing in Nigerian Secondary School Examinations (JAMB UTME, WAEC SSCE, NECO, and OAU Post-UTME).
Provide authoritative, accurate, and structured answers tailored to the Nigerian curriculum (NERDC syllabus, JAMB brochure, OAU past questions).
Use formatting like bullet points, formulas, bold text, and clear steps.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Subject context: ${subject || "General Secondary School"}, Topic: ${topic || "General"}\nStudent Question: ${prompt}`,
        config: {
          systemInstruction,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error in /api/ai/tutor:", error?.message || error);
      res.status(500).json({ error: error?.message || "Failed to contact AI Tutor." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EXAMHUB server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
