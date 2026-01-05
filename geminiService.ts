
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPrompt } from "./types.ts";

export const generatePromptFromTheme = async (theme: string): Promise<GeneratedPrompt> => {
  // Tenta obter a chave de múltiplas fontes possíveis em sites hospedados
  const getApiKey = () => {
    // 1. Padrão process.env.API_KEY
    if (process.env?.API_KEY) return process.env.API_KEY;
    
    // 2. Formato VITE (conforme print do Netlify)
    if ((process.env as any)?.VITE_API_KEY) return (process.env as any).VITE_API_KEY;
    
    // 3. Fallback para window.process
    if ((window as any).process?.env?.API_KEY) return (window as any).process.env.API_KEY;
    if ((window as any).process?.env?.VITE_API_KEY) return (window as any).process.env.VITE_API_KEY;
    
    // 4. Fallback para import.meta (Vite nativo)
    try {
      const viteKey = (import.meta as any).env?.VITE_API_KEY;
      if (viteKey) return viteKey;
    } catch (e) {}

    return null;
  };

  const rawKey = getApiKey();
  const apiKey = rawKey?.trim().replace(/['"]/g, '');
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("SISTEMA BLOQUEADO: A chave 'VITE_API_KEY' não foi detectada. Verifique se o valor está correto no Netlify e se você fez um novo DEPLOY após salvar.");
  }

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
  if (!text) throw new Error("A rede neural não retornou dados. Tente novamente.");

  try {
    const result = JSON.parse(text.trim());
    return {
      ...result,
      id: crypto.randomUUID(),
      theme,
      timestamp: Date.now()
    };
  } catch (err) {
    throw new Error("Falha na interpretação da resposta. Tente um tema diferente.");
  }
};
