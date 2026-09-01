import { useState } from "react";
import AircraftOverview from "./components/AircraftOverview.jsx";
import ParameterPanel from "./components/ParameterPanel.jsx";
import ModuleWorkspace from "./components/ModuleWorkspace.jsx";
import { featureEntries, features } from "./features/index.js";
import { getFeatureInputKeys } from "./features/featureContract.js";
import { initialAircraft } from "./data/aircraft.js";
import { createCapabilityRegistry } from "./capabilities/capabilityContract.js";
import { plannedModuleSlots } from "./data/topicCatalog.js";
import { foundationInputKeys } from "./data/lessonCatalog.js";

const capabilityRegistry = createCapabilityRegistry(featureEntries);

export default function App() {
  const [aircraft, setAircraft] = useState(initialAircraft);
  const [selectedFeatureId, setSelectedFeatureId] = useState(features[0]?.id);
  const selectedFeature = features.find((feature) => feature.id === selectedFeatureId)
    || plannedModuleSlots.find((feature) => feature.id === selectedFeatureId);
  const selectedInputKeys = getFeatureInputKeys(selectedFeature)
    || plannedModuleSlots.find((feature) => feature.id === selectedFeatureId)?.inputKeys
    || foundationInputKeys;

  function updateParameter(key, value) {
    setAircraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <header className="hero">
        <nav aria-label="Course tool identity">
          <span className="brand-mark">AERO / 01</span>
          <span>AI-Assisted Engineering Tool</span>
        </nav>
        <div className="hero-content">
          <div>
            <p className="eyebrow">Introduction to aerospace engineering</p>
            <h1>Turn physics into a<br /><em>verified</em> design tool.</h1>
          </div>
          <p className="hero-summary">Understand the model. Specify its behavior. Ask AI for bounded code. Verify the result. Then make an engineering decision.</p>
        </div>
        <div className="workflow" aria-label="Course workflow">
          {["Understand", "Specify", "Verify", "Implement", "Test", "Decide"].map((step, index) => (
            <span key={step}><b>{String(index + 1).padStart(2, "0")}</b>{step}</span>
          ))}
        </div>
      </header>

      <main>
        <div className="section-rule"><span>AIRCRAFT</span><p>The same shared aircraft persists while each module reveals a different engineering relationship.</p></div>
        <ModuleWorkspace featureEntries={featureEntries} registry={capabilityRegistry} aircraft={aircraft} selectedId={selectedFeatureId} onSelect={setSelectedFeatureId} />
        <div className="section-rule"><span>INPUTS</span><p>Only the current module's declared inputs are shown; legacy modules continue to receive the complete aircraft state.</p></div>
        <ParameterPanel aircraft={aircraft} onChange={updateParameter} inputKeys={selectedInputKeys} />
        <AircraftOverview aircraft={aircraft} parameterKeys={selectedInputKeys} />
      </main>

      <footer>
        <p>Models inform decisions. Verification earns confidence.</p>
        <span>SI units throughout</span>
      </footer>
    </>
  );
}
