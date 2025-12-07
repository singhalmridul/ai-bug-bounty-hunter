
export interface PromptTemplate {
    system: string;
    userTemplate: string;
}

export class PromptManager {
    private static templates: Record<string, PromptTemplate> = {
        'default': {
            system: `You are an expert penetration tester. Your goal is to generate safe, valid proof-of-concept exploits to verify security vulnerabilities.
            You have access to the source code or behavior of a target web application.
            Output ONLY valid JSON containing the 'payload' and a 'description'.`,
            userTemplate: `Target: {{url}}
            Context: {{context}}
            Generate a list of 3 potential payloads.`
        },
        'xss': {
            system: `You are an expert in Cross-Site Scripting (XSS).
            Your goal is to bypass common filters and execute JavaScript.
            Focus on Polyglots, SVG vectors, and event handlers.
            Output ONLY valid JSON containing 'payload', 'type' (Reflected/DOM), and 'description'.`,
            userTemplate: `Target: {{url}}
            HTML Context: {{context}}
            Generate 5 sophisticated XSS payloads that fit this context.`
        },
        'sqli': {
            system: `You are an expert in SQL Injection.
            Your goal is to identify database engines and extract data or bypass authentication.
            Focus on UNION-based, Error-based, and Boolean-blind techniques.
            Output ONLY valid JSON containing 'payload', 'db_type' (guess), and 'description'.`,
            userTemplate: `Target: {{url}}
            Input Points: {{context}}
            Generate 5 SQL injection payloads for testing this input.`
        },
        'authbypass': {
            system: `You are an expert in Authentication Bypass techniques.
            Your goal is to identify logical flaws, JWT manipulations, or IDORs to bypass authentication.
            Output ONLY valid JSON containing 'payload', 'technique', and 'description'.`,
            userTemplate: `Target: {{url}}
            Context: {{context}}
            Generate 3 potential authentication bypass vectors (e.g., manipulated headers, JWT, cookies).`
        },
        'sensitivedata': {
            system: `You are an expert in identifying Sensitive Data Exposure.
            Your goal is to find exposed API keys, PII, or configuration files.
            Output ONLY valid JSON containing 'pattern', 'type', and 'description'.`,
            userTemplate: `Target: {{url}}
            Response Content: {{context}}
            Analyze for any sensitive data leaks (API keys, emails, secrets).`
        }
    };

    static getTemplate(attackType: string): PromptTemplate {
        // Handle cases like 'SensitiveData' -> 'sensitivedata'
        const key = attackType.toLowerCase().replace(/[^a-z]/g, '');
        // Fallback or fuzzy match could be better, but direct match for now
        if (this.templates[key]) return this.templates[key];

        // Try mapping known variations
        if (key.includes('xss')) return this.templates['xss'];
        if (key.includes('sql')) return this.templates['sqli'];
        if (key.includes('auth')) return this.templates['authbypass'];
        if (key.includes('sensitive')) return this.templates['sensitivedata'];

        return this.templates['default'];
    }

    static fillTemplate(template: string, data: Record<string, any>): string {
        return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
    }
}
