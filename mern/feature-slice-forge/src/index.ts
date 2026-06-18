export interface FeatureSlice {
  feature: string;
  backend: readonly string[];
  frontend: readonly string[];
}

export const featureSliceForge = {
  async create(feature: string): Promise<FeatureSlice> {
    const f = feature.toLowerCase();
    const cap = f.charAt(0).toUpperCase() + f.slice(1);
    return {
      feature: f,
      backend: [`${f}.model.js`, `${f}.routes.js`, `${f}.controller.js`, `${f}.service.js`],
      frontend: [`${cap}Page.jsx`, `use${cap}s.js`, `${f}.types.ts`],
    };
  },
};
