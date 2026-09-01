import { useState } from "react";
import AircraftOverview from "./components/AircraftOverview.jsx";
import AnalysisWorkspace from "./components/AnalysisWorkspace.jsx";
import ParameterPanel from "./components/ParameterPanel.jsx";
import { features } from "./features/index.js";
import { initialAircraft } from "./data/aircraft.js";
import { lessonCatalog } from "./data/lessonCatalog.js";

export default function App() {
  const [aircraft, setAircraft] = useState(initialAircraft);
  const [selectedLessonId, setSelectedLessonId] = useState("foundations");
  const selectedLesson = lessonCatalog.find((lesson) => lesson.id === selectedLessonId) ?? lessonCatalog[0];

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
        <AircraftOverview aircraft={aircraft} parameterKeys={selectedLesson.parameterKeys} />
        <div className="section-rule"><span>INPUTS</span><p>One shared aircraft state feeds every registered analysis feature.</p></div>
        <ParameterPanel
          aircraft={aircraft}
          onChange={updateParameter}
          parameterKeys={selectedLesson.parameterKeys}
        />
        <div className="section-rule"><span>ANALYSIS</span><p>Student physics stays in pure JavaScript modules; the shared core presents results and decisions.</p></div>
        <AnalysisWorkspace
          aircraft={aircraft}
          features={features}
          selectedLessonId={selectedLessonId}
          onLessonChange={setSelectedLessonId}
        />
      </main>

      <footer>
        <p>Models inform decisions. Verification earns confidence.</p>
        <span>SI units throughout</span>
      </footer>
    </>
  );
}
