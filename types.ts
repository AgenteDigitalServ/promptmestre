
export interface GeneratedPrompt {
  id: string;
  theme: string;
  category: string;
  mainPrompt: {
    persona: string;
    objective: string;
    targetAudience: string;
    level: string;
    tone: string;
    fullContent: string;
  };
  variations: string[];
  usageAdvice: string;
  timestamp: number;
}

export interface PromptState {
  currentPrompt: GeneratedPrompt | null;
  history: GeneratedPrompt[];
  isLoading: boolean;
  error: string | null;
}
