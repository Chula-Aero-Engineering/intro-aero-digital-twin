import { parameterDefinitions } from "../data/aircraft.js";

export default function AircraftOverview({ aircraft }) {
  return (
    <section className="panel overview" aria-labelledby="overview-title">
      <div className="section-heading">
        <p className="eyebrow">Current design state</p>
        <h2 id="overview-title">Aircraft overview</h2>
      </div>
      <dl className="parameter-grid">
        {parameterDefinitions.map(({ key, label, unit }) => (
          <div className="parameter-readout" key={key}>
            <dt>{label}</dt>
            <dd>{aircraft[key]} <span>{unit}</span></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
