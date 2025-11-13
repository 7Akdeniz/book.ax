import { SlugGenerator } from '../common/utils/slug.util';

describe('SlugGenerator', () => {
  describe('generate', () => {
    it('should generate lowercase slugs', () => {
      expect(SlugGenerator.generate('Berlin')).toBe('berlin');
      expect(SlugGenerator.generate('NEW YORK')).toBe('new-york');
    });

    it('should replace spaces with hyphens', () => {
      expect(SlugGenerator.generate('Los Angeles')).toBe('los-angeles');
      expect(SlugGenerator.generate('New York City')).toBe('new-york-city');
    });

    it('should remove special characters', () => {
      expect(SlugGenerator.generate('München')).toBe('munchen');
      expect(SlugGenerator.generate("O'Brien")).toBe('obrien');
      expect(SlugGenerator.generate('São Paulo')).toBe('sao-paulo');
    });

    it('should handle umlauts and accents', () => {
      expect(SlugGenerator.generate('Köln')).toBe('koln');
      expect(SlugGenerator.generate('Zürich')).toBe('zurich');
    });
  });

  describe('generateUnique', () => {
    it('should append counter if slug exists', () => {
      const existing = ['berlin', 'berlin-1'];
      expect(SlugGenerator.generateUnique('Berlin', existing)).toBe('berlin-2');
    });

    it('should return original if not exists', () => {
      const existing = ['munich', 'hamburg'];
      expect(SlugGenerator.generateUnique('Berlin', existing)).toBe('berlin');
    });
  });

  describe('validateSlug', () => {
    it('should validate correct slugs', () => {
      expect(SlugGenerator.validateSlug('berlin')).toBe(true);
      expect(SlugGenerator.validateSlug('new-york')).toBe(true);
      expect(SlugGenerator.validateSlug('san-francisco-bay-area')).toBe(true);
    });

    it('should reject invalid slugs', () => {
      expect(SlugGenerator.validateSlug('Berlin')).toBe(false);
      expect(SlugGenerator.validateSlug('new york')).toBe(false);
      expect(SlugGenerator.validateSlug('berlin!')).toBe(false);
      expect(SlugGenerator.validateSlug('münchen')).toBe(false);
    });
  });
});
