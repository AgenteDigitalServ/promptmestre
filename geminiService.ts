
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPrompt } from "./types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePromptFromTheme = async (theme: string): Promise<GeneratedPrompt> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere um prompt mestre profissional para o tema: "${theme}". 
    Infira automaticamente o público-alvo, nível de profundidade e o melhor tom.
    O prompt deve ser estruturado conforme o template interno de especialista.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "A categoria geral do tema (ex: Negócios, Educação, Tecnologia)" },
          mainPrompt: {
            type: Type.OBJECT,
            properties: {
              persona: { type: Type.STRING },
              objective: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              level: { type: Type.STRING },
              tone: { type: Type.STRING },
              fullContent: { type: Type.STRING, description: "O prompt completo formatado para ser copiado diretamente" }
            },
            required: ["persona", "objective", "targetAudience", "level", "tone", "fullContent"]
          },
          variations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2 a 3 variações curtas do prompt para diferentes nuances"
          },
          usageAdvice: { type: Type.STRING, description: "Sugestão de uso em modelos como ChatGPT, Claude ou Midjourney" }
        },
        required: ["category", "mainPrompt", "variations", "usageAdvice"]
      }
    }
  });

  const result = JSON.parse(response.text.trim());
  
  return {
    ...result,
    id: crypto.randomUUID(),
    theme,
    timestamp: Date.now()
  };
};
