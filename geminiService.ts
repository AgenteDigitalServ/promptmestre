
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPrompt } from "./types.ts";

export const generatePromptFromTheme = async (theme: string): Promise<GeneratedPrompt> => {
  // Inicialização direta. O erro no navegador ocorre se process.env.API_KEY for undefined.
  // Em ambientes de desenvolvimento locais ou hospedagens com build, este valor é injetado.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Modelo recomendado para contas gratuitas e respostas rápidas
    contents: [{
      parts: [{
        text: `Atue como um Engenheiro de Prompt Sênior. Gere um prompt mestre altamente detalhado para o tema: "${theme}". 
        Inclua Persona, Contexto, Instruções Passo a Passo e Formato de Saída.
        Responda estritamente em JSON.`
      }]
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          mainPrompt: {
            type: Type.OBJECT,
            properties: {
              persona: { type: Type.STRING },
              objective: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              level: { type: Type.STRING },
              tone: { type: Type.STRING },
              fullContent: { type: Type.STRING }
            },
            required: ["persona", "objective", "targetAudience", "level", "tone", "fullContent"]
          },
          variations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          usageAdvice: { type: Type.STRING }
        },
        required: ["category", "mainPrompt", "variations", "usageAdvice"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("A rede neural não retornou dados.");

  try {
    const result = JSON.parse(text.trim());
    return {
      ...result,
      id: crypto.randomUUID(),
      theme,
      timestamp: Date.now()
    };
  } catch (err) {
    throw new Error("Erro ao decodificar a resposta neural. Tente novamente.");
  }
};
