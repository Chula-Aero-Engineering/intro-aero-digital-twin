// Core demonstrations and student analyses share one read-only rendering contract.
const coreFeatureModules = import.meta.glob("../demonstrations/*.feature.js", { eager: true });
const studentFeatureModules = import.meta.glob("../../student/features/*.feature.js", { eager: true });

const featureModules = {
  ...coreFeatureModules,
  ...studentFeatureModules,
};

export const features = Object.values(featureModules)
  .map((module) => module.feature)
  .filter((feature) => feature && typeof feature === "object")
  .sort((a, b) => String(a.title).localeCompare(String(b.title)));
