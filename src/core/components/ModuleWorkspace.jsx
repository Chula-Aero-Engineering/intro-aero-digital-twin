import { useCallback, useMemo, useState } from "react";
import FeatureCard from "../features/FeatureCard.jsx";
import { resolveFeatureAnalysis } from "../features/featureContract.js";
import AircraftViewport from "../visualization/AircraftViewport.jsx";
import EngineeringPlot from "../visualization/EngineeringPlot.jsx";
import { learningModeFor, learningModes } from "../data/learningModes.js";
import { buildCurriculum } from "../data/curriculum.js";
import { capabilityContext } from "../simulation/runtime.js";
import SimulationPanel, { simulationPlot } from "../simulation/SimulationPanel.jsx";
import { showsSimulationResponse, simulationDisplayMode } from "../simulation/displayMode.js";
import EvidenceReport from "./EvidenceReport.jsx";
import { modelsForFeature } from "../capabilities/capabilityContract.js";

function statusLabel(module) {
  if (module.status === "installed" && module.runtimeReady && simulationDisplayMode(module.feature) === "analysis-only") return "Installed · capability ready";
  if (module.status === "installed" && module.runtimeReady) return "Installed · simulation ready";
  if (module.status === "installed") return "Installed analysis";
  if (module.status === "ready") return "Ready to build";
  const missing = module.requirements.filter(({ satisfied }) => !satisfied).length;
  return `Locked · ${missing} prerequisite${missing === 1 ? "" : "s"}`;
}

export default function ModuleWorkspace({ featureEntries, registry, aircraft, selectedId, onSelect }) {
  const curriculum = useMemo(() => buildCurriculum(featureEntries, registry), [featureEntries, registry]);
  const selectedModule = curriculum.flatMap((topic) => topic.modules).find((module) => module.feature.id === selectedId);
  const initialTopic = selectedModule?.feature.topicId || curriculum.find((topic) => topic.modules.length)?.id || curriculum[0]?.id;
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopic);
  const activeTopic = curriculum.find((topic) => topic.id === selectedTopicId) || curriculum[0];
  const topicModules = activeTopic?.modules || [];
  const activeModule = topicModules.find((module) => module.feature.id === selectedId) || topicModules[0];
  const activeFeature = activeModule?.feature;
  const activeModeId = learningModeFor(activeFeature);
  const activeMode = learningModes.find((mode) => mode.id === activeModeId);
  const visibleModules = topicModules.filter((module) => learningModeFor(module.feature) === activeModeId);
  const modelEntries = useMemo(
    () => activeModule?.entry ? modelsForFeature(activeFeature.id, registry) : [],
    [activeModule, activeFeature, registry],
  );
  const showSimulation = showsSimulationResponse(activeFeature, activeModule?.runtimeReady);
  const analysis = useMemo(() => {
    if (!activeModule?.entry || activeModule.status !== "installed") return null;
    try {
      return resolveFeatureAnalysis(activeFeature, aircraft, capabilityContext(modelEntries, aircraft, activeFeature.simulation));
    } catch {
      return resolveFeatureAnalysis(activeFeature, aircraft, {});
    }
  }, [activeModule, activeFeature, aircraft, modelEntries]);
  const [session, setSession] = useState(null);
  const onSessionChange = useCallback((next) => setSession(next), []);
  const livePlot = showSimulation ? simulationPlot(session) : null;

  function chooseTopic(topic) {
    setSelectedTopicId(topic.id);
    const first = topic.modules[0];
    if (first) onSelect(first.feature.id);
  }

  if (!activeTopic) return <p>No course topics are registered.</p>;

  return (
    <section className="module-workspace" aria-labelledby="modules-title">
      <aside className="module-rail">
        <p className="eyebrow">Aircraft capability map</p>
        <h2 id="modules-title">Course topics</h2>
        <div className="topic-tabs" role="tablist" aria-label="Course topics">
          {curriculum.map((topic) => (
            <button key={topic.id} type="button" role="tab" aria-selected={topic.id === activeTopic.id} className={topic.id === activeTopic.id ? "active" : ""} onClick={() => chooseTopic(topic)}>
              <strong>{topic.shortTitle}</strong><small>{topic.modules.length} modules</small>
            </button>
          ))}
        </div>
        <p className="topic-purpose">{activeTopic.description}</p>
        {topicModules.length > 0 ? (
          <>
            <div className="learning-mode-tabs" role="tablist" aria-label="Learning modes">
              {learningModes.map((mode) => {
                const firstModule = topicModules.find((module) => learningModeFor(module.feature) === mode.id);
                return (
                  <button key={mode.id} type="button" role="tab" aria-selected={mode.id === activeModeId} className={mode.id === activeModeId ? "active" : ""} disabled={!firstModule} onClick={() => firstModule && onSelect(firstModule.feature.id)}>
                    <span>{mode.number}</span><strong>{mode.title}</strong>
                  </button>
                );
              })}
            </div>
            <div className="mode-purpose"><strong>{activeMode?.question}</strong><span>{activeMode?.description}</span></div>
            <p className="module-rail-intro">Modules in this topic and mode</p>
            <div className="module-tabs" role="tablist" aria-label={`${activeTopic.title} modules`}>
              {visibleModules.map((module) => (
                <button key={module.feature.id} type="button" role="tab" aria-selected={module.feature.id === activeFeature?.id} className={`${module.feature.id === activeFeature?.id ? "active " : ""}module-${module.status}`} onClick={() => onSelect(module.feature.id)}>
                  <span>{module.descriptor?.stage ? String(module.descriptor.stage).padStart(2, "0") : "•"}</span>
                  <strong>{module.feature.title}</strong><small>{statusLabel(module)}</small>
                </button>
              ))}
            </div>
          </>
        ) : <p className="empty-topic">No public module slots have been released for this topic yet.</p>}
      </aside>

      <div className="module-stage" role="tabpanel">
        {activeModule ? (
          <>
            <AircraftViewport aircraft={aircraft} scene={analysis?.scene} attitude={showSimulation ? session?.state : null} />
            {activeModule.status === "installed" && showSimulation && <SimulationPanel activeModule={activeModule} registry={registry} aircraft={aircraft} onSessionChange={onSessionChange} />}
            {activeModule.entry ? (
              <>
                {(analysis?.plots || []).map((plot) => <EngineeringPlot key={plot.id || plot.title} plot={plot} />)}
                {livePlot && <EngineeringPlot plot={livePlot} />}
                <FeatureCard feature={activeFeature} aircraft={aircraft} analysis={analysis} sequence={activeModule.descriptor?.stage || visibleModules.findIndex((module) => module.feature.id === activeFeature.id) + 1} />
                <EvidenceReport aircraft={aircraft} activeModule={activeModule} registry={registry} analysis={analysis} session={showSimulation ? session : null} />
              </>
            ) : (
              <article className={`planned-module planned-${activeModule.status}`}>
                <p className="eyebrow">{activeModule.status === "ready" ? "Prerequisites satisfied" : "Capability locked"}</p>
                <h2>{activeFeature.title}</h2><p>{activeFeature.description}</p>
                <code>src/student/features/{activeFeature.id}.feature.js</code>
                {activeModule.requirements.length > 0 && <div className="prerequisite-list"><strong>Required capabilities</strong><ul>{activeModule.requirements.map((requirement) => <li key={requirement.id} className={requirement.satisfied ? "satisfied" : "missing"}>{requirement.satisfied ? "✓" : "○"} {requirement.id} v{requirement.version}</li>)}</ul></div>}
                <p>The public shell contains no solution equations or reference output. Build the normal three student-owned files during the lesson; discovery replaces this slot automatically.</p>
              </article>
            )}
          </>
        ) : (
          <article className="planned-module empty-stage"><p className="eyebrow">Topic space reserved</p><h2>{activeTopic.title}</h2><p>{activeTopic.description}</p><p>Future modules can join the same aircraft and capability graph without changing the application architecture.</p></article>
        )}
      </div>
    </section>
  );
}
