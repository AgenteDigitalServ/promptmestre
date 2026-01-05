
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPrompt } from "./types.ts";

export const generatePromptFromTheme = async (theme: string): Promise<GeneratedPrompt> => {
  // Busca a chave em process.env.API_KEY ou VITE_API_KEY (comum em hospedagens como Netlify/Vercel)
  const rawKey = process.env.API_KEY || (process.env as any).VITE_API_KEY || "";
  const apiKey = rawKey.trim().replace(/['"]/g, '');
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("CHAVE NÃO DETECTADA: Certifique-se de que a variável de ambiente está salva no painel do site e que você realizou um novo DEPLOY após configurá-la.");
  }

  // Inicializa o cliente com a chave encontrada
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: [{
      parts: [{
        text: `Atue como um Engenheiro de Prompt Sênior. Gere um prompt mestre detalhado para o tema: "${theme}". 
        O prompt deve incluir Persona, Contexto, Instruções Passo a Passo e Formato de Saída.
        Responda obrigatoriamente em JSON puro.`
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
  if (!text) throw new Error("A rede neural não retornou dados. Verifique sua conexão ou cota da API.");

  try {
    const result = JSON.parse(text.trim());
    return {
      ...result,
      id: crypto.randomUUID(),
      theme,
      timestamp: Date.now()
    };
  } catch (err) {
    throw new Error("Erro ao processar a resposta da IA. Tente reformular o tema.");
  }
};
