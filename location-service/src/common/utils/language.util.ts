export type SupportedLanguage = 'de' | 'en' | 'es' | 'fr' | 'tr';

export interface MultiLanguageField {
  name_en?: string;
  name_de?: string;
  name_es?: string;
  name_fr?: string;
  name_tr?: string;
  name?: string;
}

export class LanguageUtil {
  private static readonly LANGUAGE_PRIORITY: SupportedLanguage[] = ['en', 'de', 'es', 'fr', 'tr'];
  private static readonly DEFAULT_LANGUAGE: SupportedLanguage = 'en';

  static getLocalizedName(
    entity: MultiLanguageField,
    preferredLanguage: SupportedLanguage = 'en'
  ): string {
    // Try preferred language
    const langField = `name_${preferredLanguage}` as keyof MultiLanguageField;
    if (entity[langField]) {
      return entity[langField] as string;
    }

    // Try default 'name' field
    if (entity.name) {
      return entity.name;
    }

    // Try language priority fallback
    for (const lang of this.LANGUAGE_PRIORITY) {
      const field = `name_${lang}` as keyof MultiLanguageField;
      if (entity[field]) {
        return entity[field] as string;
      }
    }

    // Last resort: return any available name field
    return entity.name_en || entity.name_de || entity.name_es || entity.name_fr || entity.name_tr || 'Unknown';
  }

  static getAllTranslations(entity: MultiLanguageField): Record<string, string> {
    return {
      en: entity.name_en || entity.name || '',
      de: entity.name_de || entity.name || '',
      es: entity.name_es || entity.name || '',
      fr: entity.name_fr || entity.name || '',
      tr: entity.name_tr || entity.name || '',
    };
  }

  static isSupportedLanguage(lang: string): lang is SupportedLanguage {
    return ['de', 'en', 'es', 'fr', 'tr'].includes(lang);
  }

  static getDefaultLanguage(): SupportedLanguage {
    return this.DEFAULT_LANGUAGE;
  }
}
