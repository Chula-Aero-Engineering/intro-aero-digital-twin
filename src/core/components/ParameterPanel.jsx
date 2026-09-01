import { parameterDefinitions } from "../data/aircraft.js";

export default function ParameterPanel({ aircraft, onChange, parameterKeys }) {
  const visibleDefinitions = parameterDefinitions.filter(({ key }) => parameterKeys.includes(key));

  return (
    <section className="panel" aria-labelledby="parameters-title">
      <div className="section-heading">
        <p className="eyebrow">Shared SI inputs</p>
        <h2 id="parameters-title">Adjust parameters</h2>
      </div>
      <div className="input-grid">
        {visibleDefinitions.map(({ key, label, unit, min, step }) => (
          <label className="field" key={key}>
            <span>{label}</span>
            <span className="input-with-unit">
              <input
                type="number"
                min={min}
                step={step}
                value={aircraft[key]}
                onChange={(event) => onChange(key, Number(event.target.value))}
              />
              <span>{unit}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
