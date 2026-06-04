export class QueueFlow { private m = new Map<string, (p: unknown)=>Promise<void>>();
register(name: string, fn: (p: unknown)=>Promise<void>){ this.m.set(name, fn); return this; }
async push(name: string, payload: unknown, tries=2){ const fn=this.m.get(name); if(!fn) throw new Error("queueflowkit: unknown "+name); let last: unknown;
for(let i=0;i<=tries;i++){ try{ await fn(payload); return; }catch(e){ last=e; if(i===tries)throw e;} } throw last; } }
export const queueflowkit = () => new QueueFlow();
