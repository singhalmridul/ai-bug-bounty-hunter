export interface AICompletionRequest {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
    temperature?: number;
}

export interface AICompletionResponse {
    content: string;
    usage?: {
        totalTokens: number;
        inputTokens: number;
        outputTokens: number;
    };
}

export interface IAIService {
    generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse>;
}
