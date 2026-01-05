
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPrompt } from "./types.ts";

export const generatePromptFromTheme = async (theme: string): Promise<GeneratedPrompt> => {
  // Verificação de segurança da chave
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("CHAVE_FALTANDO: A chave de API (API_KEY) não foi detectada. Verifique as configurações de ambiente da hospedagem.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{
      parts: [{
        text: `Você é um Engenheiro de Prompt Sênior especialista em LLMs. 
        Sua tarefa é criar um prompt de elite para o tema: "${theme}". 
        O prompt resultante deve ser rico em contexto, definir uma persona clara e objetivos específicos.
        Responda obrigatoriamente em formato JSON puro.`
      }]
    }],
    config: {
      thinkingConfig: { thinkingBudget: 8000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Categoria do prompt (ex: Software, Marketing, Acadêmico)" },
          mainPrompt: {
            type: Type.OBJECT,
            properties: {
              persona: { type: Type.STRING, description: "Persona sugerida" },
              objective: { type: Type.STRING, description: "Objetivo do prompt" },
              targetAudience: { type: Type.STRING, description: "Público alvo" },
              level: { type: Type.STRING, description: "Nível de complexidade" },
              tone: { type: Type.STRING, description: "Tom de voz" },
              fullContent: { type: Type.STRING, description: "O conteúdo completo do prompt pronto para copiar" }
            },
            required: ["persona", "objective", "targetAudience", "level", "tone", "fullContent"]
          },
          variations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2 variações alternativas"
          },
          usageAdvice: { type: Type.STRING, description: "Conselho para melhor performance" }
        },
        required: ["category", "mainPrompt", "variations", "usageAdvice"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("RESPOSTA_VAZIA: O motor neural não retornou dados. Tente um tema mais específico.");
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
    console.error("Erro ao processar JSON:", text);
    throw new Error("ERRO_SINTAXE: Falha ao decodificar a resposta neural. Reiniciando buffers...");
  }
};
