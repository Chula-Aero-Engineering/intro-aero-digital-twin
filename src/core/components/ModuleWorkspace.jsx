import { useMemo } from "react";
import FeatureCard from "../features/FeatureCard.jsx";
import { resolveFeatureAnalysis } from "../features/featureContract.js";
import AircraftViewport from "../visualization/AircraftViewport.jsx";
import EngineeringPlot from "../visualization/EngineeringPlot.jsx";

export default function ModuleWorkspace({ features, plannedFeatures = [], aircraft, selectedId, onSelect }) {
  const installedIds = new Set(features.map((feature) => feature.id));
  const modules = [...features, ...plannedFeatures.filter((feature) => !installedIds.has(feature.id))];
  const fallbackId = modules[0]?.id;
  const activeId = modules.some((feature) => feature.id === selectedId) ? selectedId : fallbackId;
  const activeFeature = modules.find((feature) => feature.id === activeId);
  const analysis = useMemo(
    () => activeFeature && !activeFeature.planned ? resolveFeatureAnalysis(activeFeature, aircraft) : null,
    [activeFeature, aircraft],
  );

  if (!activeFeature) return <p>No analysis modules are registered.</p>;

  return (
    <section className="module-workspace" aria-labelledby="modules-title">
      <aside className="module-rail">
        <p className="eyebrow">Capability stack</p>
        <h2 id="modules-title">Course modules</h2>
        <p className="module-rail-intro">One aircraft gains new capabilities as the course progresses.</p>
        <div className="module-tabs" role="tablist" aria-label="Analysis modules">
          {modules.map((feature, index) => (
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
              <small>{feature.category || (feature.contractVersion === 2 ? "Visualization-ready" : "Analysis")}</small>
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
            <FeatureCard feature={activeFeature} aircraft={aircraft} analysis={analysis} sequence={modules.findIndex((feature) => feature.id === activeId) + 1} />
          </>
        )}
      </div>
    </section>
  );
}
