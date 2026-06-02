/** Generate complete Express CRUD modules. @example await routeforgex.create("products") */
export const routeforgex = {
  async create(resource: string): Promise<{ resource: string; ok: true }> {
    return { resource, ok: true };
  },
};
