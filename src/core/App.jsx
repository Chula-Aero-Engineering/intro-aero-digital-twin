import { useState } from "react";
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
    <div className="app-shell">
      <header className="app-header">
        <nav aria-label="Course tool identity">
          <span className="brand-mark">AERO / 01</span>
          <span>AI-Assisted Engineering Tool</span>
        </nav>
        <div className="app-title">
          <p>Introduction to aerospace engineering</p>
          <h1>Verified aircraft workspace</h1>
        </div>
        <p className="app-motto">Understand · Specify · Verify · Implement · Test · Decide</p>
      </header>

      <main>
        <ModuleWorkspace
          featureEntries={featureEntries}
          registry={capabilityRegistry}
          aircraft={aircraft}
          inputKeys={selectedInputKeys}
          selectedId={selectedFeatureId}
          onAircraftChange={updateParameter}
          onSelect={setSelectedFeatureId}
        />
      </main>

      <footer>
        <p>Models inform decisions. Verification earns confidence.</p>
        <span>SI units throughout</span>
      </footer>
    </div>
  );
}
