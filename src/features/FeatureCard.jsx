import EngineeringDecision from "../components/EngineeringDecision.jsx";
import VerificationPanel from "../components/VerificationPanel.jsx";

function validateAnalysis(analysis) {
  if (!analysis || typeof analysis !== "object") {
    throw new TypeError("analyze() must return an analysis object.");
  }
  if (!Array.isArray(analysis.results) || analysis.results.length === 0) {
    throw new TypeError("analysis.results must contain at least one result.");
  }
  if (!Array.isArray(analysis.verificationCases) || analysis.verificationCases.length === 0) {
    throw new TypeError("analysis.verificationCases must contain at least one case.");
  }
  if (!analysis.decision || typeof analysis.decision !== "object") {
    throw new TypeError("analysis.decision is required.");
  }

  analysis.results.forEach((result) => {
    const validValue = typeof result.value === "string" || Number.isFinite(result.value);
    if (!result.label || !validValue || typeof result.unit !== "string") {
      throw new TypeError("Every result needs a label, finite number or text value, and unit string.");
    }
  });

  return analysis;
}

function formatValue(result) {
  if (typeof result.value === "string") return result.value;
  const precision = Number.isInteger(result.precision) ? result.precision : 2;
  return result.value.toFixed(precision);
}

function failedAnalysis(feature, error) {
  return {
    results: [
      {
        label: "Analysis unavailable",
        value: "—",
        unit: "",
        emphasis: true,
        note: error instanceof Error ? error.message : "The feature returned invalid data.",
      },
    ],
    verificationCases: [
      { label: "Feature output follows the application contract", passed: false },
    ],
    decision: {
      question: feature.engineeringQuestion || "What engineering decision does this analysis enable?",
      interpretation: "No engineering interpretation is available until the feature returns valid inputs, results, verification cases, and decision data.",
      status: "caution",
    },
  };
}

export default function FeatureCard({ feature, aircraft, sequence }) {
  let analysis;

  try {
    if (typeof feature.analyze !== "function") {
      throw new TypeError("The feature must export an analyze(aircraft) function.");
    }
    analysis = validateAnalysis(feature.analyze(aircraft));
  } catch (error) {
    analysis = failedAnalysis(feature, error);
  }

  return (
    <article className="feature-card">
      <header>
        <span className="feature-number">{String(sequence).padStart(2, "0")}</span>
        <div>
          <h2>{feature.title || "Unnamed analysis"}</h2>
          <p>{feature.description || "No feature description was supplied."}</p>
        </div>
      </header>

      <div className="feature-content">
        {analysis.results.map((result) => (
          <div
            className={`result-block${result.emphasis ? " primary-result" : ""}`}
            key={result.label}
          >
            <p>{result.label}</p>
            <strong>
              {formatValue(result)} {result.unit && <small>{result.unit}</small>}
            </strong>
            {result.note && <span>{result.note}</span>}
          </div>
        ))}

        <VerificationPanel cases={analysis.verificationCases} />
        <EngineeringDecision
          question={analysis.decision.question}
          interpretation={analysis.decision.interpretation}
          tone={analysis.decision.status}
        />
      </div>
    </article>
  );
}
