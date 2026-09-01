import { useMemo } from "react";
import FeatureCard from "../features/FeatureCard.jsx";
import { resolveFeatureAnalysis } from "../features/featureContract.js";
import AircraftViewport from "../visualization/AircraftViewport.jsx";
import EngineeringPlot from "../visualization/EngineeringPlot.jsx";
import { learningModeFor, learningModes } from "../data/learningModes.js";

export default function ModuleWorkspace({ features, plannedFeatures = [], aircraft, selectedId, onSelect }) {
  const installedIds = new Set(features.map((feature) => feature.id));
  const modules = [...features, ...plannedFeatures.filter((feature) => !installedIds.has(feature.id))];
  const fallbackId = modules[0]?.id;
  const activeId = modules.some((feature) => feature.id === selectedId) ? selectedId : fallbackId;
  const activeFeature = modules.find((feature) => feature.id === activeId);
  const activeModeId = learningModeFor(activeFeature);
  const activeMode = learningModes.find((mode) => mode.id === activeModeId);
  const visibleModules = modules.filter((feature) => learningModeFor(feature) === activeModeId);
  const analysis = useMemo(
    () => activeFeature && !activeFeature.planned ? resolveFeatureAnalysis(activeFeature, aircraft) : null,
    [activeFeature, aircraft],
  );

  if (!activeFeature) return <p>No analysis modules are registered.</p>;

  return (
    <section className="module-workspace" aria-labelledby="modules-title">
      <aside className="module-rail">
        <p className="eyebrow">Learning progression</p>
        <h2 id="modules-title">Three engineering modes</h2>
        <div className="learning-mode-tabs" role="tablist" aria-label="Learning modes">
          {learningModes.map((mode) => {
            const firstModule = modules.find((feature) => learningModeFor(feature) === mode.id);
            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={mode.id === activeModeId}
                className={mode.id === activeModeId ? "active" : ""}
                disabled={!firstModule}
                onClick={() => firstModule && onSelect(firstModule.id)}
              >
                <span>{mode.number}</span>
                <strong>{mode.title}</strong>
              </button>
            );
          })}
        </div>
        <div className="mode-purpose">
          <strong>{activeMode?.question}</strong>
          <span>{activeMode?.description}</span>
        </div>
        <p className="module-rail-intro">Available modules in this mode</p>
        <div className="module-tabs" role="tablist" aria-label="Analysis modules">
          {visibleModules.map((feature, index) => (
            <button
              key={feature.id}
              type="button"
              role="tab"
              aria-selected={feature.id === activeId}
              className={feature.id === activeId ? "active" : ""}
              onClick={() => onSelect(feature.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{feature.title}</strong>
              <small>{feature.category || ((feature.contractVersion ?? 1) >= 2 ? "Visualization-ready" : "Analysis")}</small>
            </button>
          ))}
        </div>
      </aside>

      <div className="module-stage" role="tabpanel">
        <AircraftViewport aircraft={aircraft} scene={analysis?.scene} />
        {activeFeature.planned ? (
          <article className="planned-module">
            <p className="eyebrow">Student capability not installed</p>
            <h2>{activeFeature.title}</h2>
            <p>{activeFeature.description}</p>
            <code>src/student/features/{activeFeature.id}.feature.js</code>
            <p>Complete the lesson specification and add the normal three student-owned files. This slot will be replaced automatically when the feature ID is discovered.</p>
          </article>
        ) : (
          <>
            {(analysis?.plots || []).map((plot) => <EngineeringPlot key={plot.id || plot.title} plot={plot} />)}
            <FeatureCard feature={activeFeature} aircraft={aircraft} analysis={analysis} sequence={visibleModules.findIndex((feature) => feature.id === activeId) + 1} />
          </>
        )}
      </div>
    </section>
  );
}
