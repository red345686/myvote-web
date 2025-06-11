'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { translationService } from '../src/app/lib/translation-service';

interface LanguageContextType {
    currentLanguage: string;
    setLanguage: (language: string) => void;
    translate: (text: string) => Promise<string>;
    isTranslating: boolean;
    supportedLanguages: Array<{ code: string; name: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);

    const setLanguage = useCallback((language: string) => {
        setCurrentLanguage(language);
        localStorage.setItem('selectedLanguage', language);
    }, []);

    const translate = useCallback(async (text: string): Promise<string> => {
        if (currentLanguage === 'en') {
            return text;
        }

        setIsTranslating(true);
        try {
            const translated = await translationService.translateText(text, currentLanguage);
            return translated;
        } catch (error) {
            console.error('Translation failed:', error);
            return text;
        } finally {
            setIsTranslating(false);
        }
    }, [currentLanguage]);

    const supportedLanguages = translationService.getSupportedLanguages();

    return (
        <LanguageContext.Provider
            value={{
                currentLanguage,
                setLanguage,
                translate,
                isTranslating,
                supportedLanguages,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
