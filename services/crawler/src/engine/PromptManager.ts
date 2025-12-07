export class PromptManager {
    static getTemplate(type: string): string {
        switch (type) {
            case 'XSS':
                return `Analyze the following HTML content for Cross-Site Scripting (XSS) vulnerabilities. Look for:
1. Unsanitized user inputs reflected in the DOM.
2. Event handlers like onclick, onload with user-controlled data.
3. Script tags that might be injected.

Content:
{content}`;

            case 'SQLi':
                return `Analyze the following HTTP request parameters and page content for SQL Injection indicators. Look for:
1. URL parameters that look like database IDs.
2. Forms that submit data which might be used in a WHERE clause.
3. Error messages revealing database structure.

Content:
{content}`;

            case 'SensitiveData':
                return `Analyze the page content for exposed sensitive data. Look for:
1. API Keys (AWS, Stripe, Google Maps, etc.).
2. PII (Emails, Phone Numbers, Addresses).
3. Auth tokens or credentials in source code.

Content:
{content}`;

            default:
                return `Analyze the page for general security vulnerabilities.
Content:
{content}`;
        }
    }
}
