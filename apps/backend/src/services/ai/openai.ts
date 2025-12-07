import OpenAI from 'openai';
import { IAIService, AICompletionRequest, AICompletionResponse } from './types';

export class OpenAIService implements IAIService {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
        const response = await this.client.chat.completions.create({
            model: request.model || 'gpt-4',
            messages: [
                { role: 'system', content: request.systemPrompt },
                { role: 'user', content: request.userPrompt },
            ],
            temperature: request.temperature || 0.7,
        });

        const content = response.choices[0]?.message?.content || '';

        return {
            content,
            usage: {
                totalTokens: response.usage?.total_tokens || 0,
                inputTokens: response.usage?.prompt_tokens || 0,
                outputTokens: response.usage?.completion_tokens || 0,
            },
        };
    }
}
