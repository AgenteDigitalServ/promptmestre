
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPrompt } from "./types.ts";

export const generatePromptFromTheme = async (theme: string): Promise<GeneratedPrompt> => {
  // Inicialização padrão usando a variável de ambiente process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{
      parts: [{
        text: `Você é um Engenheiro de Prompt Sênior especialista em LLMs (ChatGPT, Claude, Gemini). 
        Sua tarefa é criar um prompt "mestre" de elite para o tema: "${theme}". 
        
        O prompt resultante deve ser estruturado com:
        - Persona clara e autoridade no assunto.
        - Objetivos específicos e restrições.
        - Guia passo a passo para a IA.
        - Formato de saída desejado.
        
        Responda obrigatoriamente em formato JSON puro.`
      }]
    }],
    config: {
      thinkingConfig: { thinkingBudget: 8000 },
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
  if (!text) {
    throw new Error("O motor neural não retornou dados. Tente reenviar o tema.");
  }

  try {
    const result = JSON.parse(text.trim());
    return {
      ...result,
      id: crypto.randomUUID(),
      theme,
      timestamp: Date.now()
    };
  } catch (parseError) {
    console.error("Falha ao processar JSON:", text);
    throw new Error("Falha ao decodificar resposta neural. Reiniciando buffers...");
  }
};
