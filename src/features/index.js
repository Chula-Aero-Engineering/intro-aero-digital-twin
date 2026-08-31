// Vite finds every data-only .feature.js file. Students never edit this registry.
const featureModules = import.meta.glob("./*.feature.js", { eager: true });

export const features = Object.values(featureModules)
  .map((module) => module.feature)
  .filter((feature) => feature && typeof feature === "object")
  .sort((a, b) => String(a.title).localeCompare(String(b.title)));
