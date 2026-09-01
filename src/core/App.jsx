import { useState } from "react";
import AircraftOverview from "./components/AircraftOverview.jsx";
import ParameterPanel from "./components/ParameterPanel.jsx";
import ModuleWorkspace from "./components/ModuleWorkspace.jsx";
import { features } from "./features/index.js";
import { getFeatureInputKeys } from "./features/featureContract.js";
import { initialAircraft } from "./data/aircraft.js";
import { foundationInputKeys, plannedFeatureSlots } from "./data/lessonCatalog.js";

export default function App() {
  const [aircraft, setAircraft] = useState(initialAircraft);
  const [selectedFeatureId, setSelectedFeatureId] = useState(features[0]?.id);
  const allModules = [...features, ...plannedFeatureSlots.filter((slot) => !features.some((feature) => feature.id === slot.id))];
  const selectedFeature = allModules.find((feature) => feature.id === selectedFeatureId) || allModules[0];
  const selectedInputKeys = getFeatureInputKeys(selectedFeature) || foundationInputKeys;

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
        <ModuleWorkspace features={features} plannedFeatures={plannedFeatureSlots} aircraft={aircraft} selectedId={selectedFeatureId} onSelect={setSelectedFeatureId} />
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
