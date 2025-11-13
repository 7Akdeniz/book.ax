import slugify from 'slugify';

export class SlugGenerator {
  static generate(text: string, options?: { lower?: boolean; strict?: boolean }): string {
    return slugify(text, {
      lower: options?.lower ?? true,
      strict: options?.strict ?? true,
      remove: /[*+~.()'"!:@]/g,
    });
  }

  static generateUnique(text: string, existingSlugs: string[]): string {
    let slug = this.generate(text);
    let counter = 1;
    
    while (existingSlugs.includes(slug)) {
      slug = `${this.generate(text)}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  static validateSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }
}
