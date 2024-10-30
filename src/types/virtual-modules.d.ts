// src/types/virtual-modules.d.ts

declare module 'virtual:netlify-server-entry' {
  const ServerEntry: {
    default: unknown;
  };
  export default ServerEntry;
}

declare module 'virtual:netlify-edge-entry' {
  const EdgeEntry: {
    default: unknown;
  };
  export default EdgeEntry;
}