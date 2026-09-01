import { useEffect, useMemo, useState } from "react";
import { modelsForFeature } from "../capabilities/capabilityContract.js";
import { advanceSimulationSession, createSimulationSession, FIXED_STEP_S } from "./runtime.js";

function createSafeSession(entries, aircraft, scenario) {
  try {
    return createSimulationSession({ entries, aircraft, scenario });
  } catch (error) {
    return { timeS: 0, durationS: scenario.durationS || aircraft.simulationDurationS, state: {}, history: [], status: "error", error: error.message };
  }
}

export function simulationPlot(session) {
  if (!session?.history?.length) return null;
  const requestedKeys = Array.isArray(session.plotStateKeys) ? new Set(session.plotStateKeys) : null;
  const stateSeries = [
    ["Pitch angle", "pitchRad", "#ff5a36"],
    ["Roll angle", "rollRad", "#164f45"],
    ["Yaw angle", "yawRad", "#6886c5"],
  ].filter(([, key]) => (!requestedKeys || requestedKeys.has(key)) && session.history.some((sample) => Number.isFinite(sample[key])));
  return {
    id: "simulation-attitude-history",
    title: "Attitude response history",
    xLabel: "Time (s)",
    yLabel: "Angle (deg)",
    currentX: session.timeS,
    referenceLines: (session.events || []).map(({ timeS, label }) => ({ axis: "x", value: timeS, label })),
    series: stateSeries.map(([label, key, color]) => ({
      label,
      color,
      points: session.history.map((sample) => ({ x: sample.timeS, y: sample[key] * 180 / Math.PI })),
    })),
  };
}

export default function SimulationPanel({ activeModule, registry, aircraft, onSessionChange }) {
  const entries = useMemo(
    () => activeModule?.entry ? modelsForFeature(activeModule.feature.id, registry) : [],
    [activeModule, registry],
  );
  const scenario = useMemo(() => ({
    durationS: activeModule?.feature?.simulation?.durationS ?? aircraft.simulationDurationS,
    initialState: activeModule?.feature?.simulation?.initialState,
    controls: activeModule?.feature?.simulation?.controls,
    disturbance: activeModule?.feature?.simulation?.disturbance,
    plotStateKeys: activeModule?.feature?.simulation?.plotStateKeys,
  }), [activeModule, aircraft.simulationDurationS]);
  const runnable = Boolean(activeModule?.runtimeReady && entries.length > 0);
  const [session, setSession] = useState(() => createSafeSession(entries, aircraft, scenario));

  useEffect(() => {
    const next = createSafeSession(entries, aircraft, scenario);
    setSession(next);
    onSessionChange(next);
  }, [activeModule?.feature?.id, aircraft, entries, scenario, onSessionChange]);

  useEffect(() => {
    if (session.status !== "running" || !runnable) return undefined;
    const timer = window.setInterval(() => {
      setSession((current) => {
        try {
          const next = advanceSimulationSession(current, { entries, aircraft, scenario, stepS: FIXED_STEP_S });
          const running = next.status === "complete" ? next : { ...next, status: "running" };
          onSessionChange(running);
          return running;
        } catch (error) {
          const failed = { ...current, status: "error", error: error.message };
          onSessionChange(failed);
          return failed;
        }
      });
    }, FIXED_STEP_S * 1000);
    return () => window.clearInterval(timer);
  }, [session.status, runnable, entries, aircraft, scenario, onSessionChange]);

  function reset() {
    const next = createSafeSession(entries, aircraft, scenario);
    setSession(next);
    onSessionChange(next);
  }

  function step() {
    try {
      const next = advanceSimulationSession(session, { entries, aircraft, scenario });
      setSession(next);
      onSessionChange(next);
    } catch (error) {
      const failed = { ...session, status: "error", error: error.message };
      setSession(failed);
      onSessionChange(failed);
    }
  }

  function clearRun() {
    const next = { ...session, history: [] };
    setSession(next);
    onSessionChange(next);
  }

  function toggleRun() {
    const next = { ...session, status: session.status === "running" ? "paused" : "running" };
    setSession(next);
    onSessionChange(next);
  }

  return (
    <section className="simulation-panel" aria-labelledby="simulation-title">
      <div>
        <p className="eyebrow">Reduced-order runtime</p>
        <h3 id="simulation-title">Deterministic response</h3>
        <p className="simulation-disclaimer">Linear teaching models only · fixed 0.02 s RK4 step · not a validated nonlinear 6-DOF digital twin</p>
      </div>
      <div className="simulation-readout" aria-live="polite">
        <strong>{session.timeS.toFixed(2)} s</strong>
        <span>{runnable ? session.status : "Waiting for an installed Version 4 model"}</span>
      </div>
      <div className="simulation-actions">
        <button type="button" disabled={!runnable || session.status === "complete"} onClick={toggleRun}>
          {session.status === "running" ? "Pause" : "Run"}
        </button>
        <button type="button" disabled={!runnable || session.status === "running" || session.status === "complete"} onClick={step}>Step</button>
        <button type="button" disabled={!runnable} onClick={reset}>Reset</button>
        <button type="button" disabled={!runnable || session.history.length === 0} onClick={clearRun}>Clear run</button>
      </div>
      {session.error && <p className="runtime-error">{session.error}</p>}
    </section>
  );
}
