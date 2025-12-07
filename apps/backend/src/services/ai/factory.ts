import { IAIService } from './types';
import { OpenAIService } from './openai';

export class AIServiceFactory {
    static createService(): IAIService {
        const provider = process.env.AI_PROVIDER || 'openai';

        switch (provider) {
            case 'openai':
                return new OpenAIService(process.env.OPENAI_API_KEY || '');
            // Add cases for Anthropic, LocalLLM later
            default:
                throw new Error(`Unsupported AI Provider: ${provider}`);
        }
    }
}
