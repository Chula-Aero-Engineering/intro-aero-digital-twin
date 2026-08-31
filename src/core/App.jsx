import { useState } from "react";
import AircraftOverview from "./components/AircraftOverview.jsx";
import ParameterPanel from "./components/ParameterPanel.jsx";
import FeatureCard from "./features/FeatureCard.jsx";
import { features } from "./features/index.js";
import { initialAircraft } from "./data/aircraft.js";

export default function App() {
  const [aircraft, setAircraft] = useState(initialAircraft);

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
        <AircraftOverview aircraft={aircraft} />
        <div className="section-rule"><span>INPUTS</span><p>One shared aircraft state feeds every registered analysis feature.</p></div>
        <ParameterPanel aircraft={aircraft} onChange={updateParameter} />
        <div className="section-rule"><span>ANALYSIS</span><p>Student physics stays in pure JavaScript modules; the shared core presents results and decisions.</p></div>
        <section className="analysis-area" aria-labelledby="analysis-title">
          <div className="section-heading">
            <p className="eyebrow">Registered capability</p>
            <h2 id="analysis-title">Analysis features</h2>
          </div>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              aircraft={aircraft}
              sequence={index + 1}
            />
          ))}
        </section>
      </main>

      <footer>
        <p>Models inform decisions. Verification earns confidence.</p>
        <span>SI units throughout</span>
      </footer>
    </>
  );
}
