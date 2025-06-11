interface TranslationCache {
    [key: string]: string;
}

export class TranslationService {
    private apiKey: string;
    private cache: TranslationCache = {};
    private baseUrl = 'https://translation.googleapis.com/language/translate/v2';

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY || '';
    }

    async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'en'): Promise<string> {
        if (!this.apiKey) {
            console.warn('Google Translate API key not found');
            return text;
        }

        if (sourceLanguage === targetLanguage) {
            return text;
        }

        const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLanguage,
                    target: targetLanguage,
                }),
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const data = await response.json();
            const translatedText = data.data.translations[0].translatedText;

            this.cache[cacheKey] = translatedText;
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }

    getSupportedLanguages() {
        return [
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'Hindi' },
            { code: 'bn', name: 'Bengali' },
            { code: 'te', name: 'Telugu' },
            { code: 'mr', name: 'Marathi' },
            { code: 'ta', name: 'Tamil' },
            { code: 'ur', name: 'Urdu' },
            { code: 'gu', name: 'Gujarati' },
            { code: 'kn', name: 'Kannada' },
            { code: 'ml', name: 'Malayalam' },
            { code: 'or', name: 'Odia' },
            { code: 'pa', name: 'Punjabi' },
            { code: 'as', name: 'Assamese' },
        ];
    }
}

export const translationService = new TranslationService();