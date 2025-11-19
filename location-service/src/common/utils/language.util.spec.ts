import { LanguageUtil } from './language.util';

describe('LanguageUtil', () => {
  describe('getLocalizedName', () => {
    const entity = {
      name_en: 'Germany',
      name_de: 'Deutschland',
      name_fr: 'Allemagne',
      name_es: 'Alemania',
      name_tr: 'Almanya',
    };

    it('should return preferred language if available', () => {
      expect(LanguageUtil.getLocalizedName(entity, 'de')).toBe('Deutschland');
      expect(LanguageUtil.getLocalizedName(entity, 'fr')).toBe('Allemagne');
      expect(LanguageUtil.getLocalizedName(entity, 'es')).toBe('Alemania');
    });

    it('should fallback to English if preferred language not available', () => {
      const partialEntity = {
        name_en: 'Germany',
        name_de: 'Deutschland',
      };
      expect(LanguageUtil.getLocalizedName(partialEntity as any, 'fr')).toBe('Germany');
    });

    it('should fallback to any available language', () => {
      const minimalEntity = {
        name_fr: 'Allemagne',
      };
      expect(LanguageUtil.getLocalizedName(minimalEntity as any, 'de')).toBe('Allemagne');
    });

    it('should handle entity with default name field', () => {
      const entityWithName = {
        name: 'Germany',
      };
      expect(LanguageUtil.getLocalizedName(entityWithName as any, 'de')).toBe('Germany');
    });
  });

  describe('getAllTranslations', () => {
    it('should return all translations', () => {
      const entity = {
        name_en: 'Germany',
        name_de: 'Deutschland',
        name_es: 'Alemania',
      };

      const translations = LanguageUtil.getAllTranslations(entity as any);
      expect(translations.en).toBe('Germany');
      expect(translations.de).toBe('Deutschland');
      expect(translations.es).toBe('Alemania');
      expect(translations.fr).toBe('');
      expect(translations.tr).toBe('');
    });
  });

  describe('isSupportedLanguage', () => {
    it('should validate supported languages', () => {
      expect(LanguageUtil.isSupportedLanguage('de')).toBe(true);
      expect(LanguageUtil.isSupportedLanguage('en')).toBe(true);
      expect(LanguageUtil.isSupportedLanguage('fr')).toBe(true);
    });

    it('should reject unsupported languages', () => {
      expect(LanguageUtil.isSupportedLanguage('xx')).toBe(false);
      expect(LanguageUtil.isSupportedLanguage('ru')).toBe(false);
    });
  });
});
