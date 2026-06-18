const map = new Map<string, string>();

export const errorTranslator = {
  register(code: string, message: string): void {
    map.set(code, message);
  },
  translate(code: string): string {
    return map.get(code) ?? code;
  },
};
