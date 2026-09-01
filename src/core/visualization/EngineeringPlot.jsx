import { normalizePlot } from "./visualizationContract.js";

const WIDTH = 720;
const HEIGHT = 360;
const MARGIN = { left: 66, right: 24, top: 42, bottom: 58 };

function ticks(min, max, count = 5) {
  if (min === max) return [min];
  return Array.from({ length: count }, (_, index) => min + ((max - min) * index) / (count - 1));
}

function formatTick(value) {
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.01)) return value.toExponential(1);
  return Number(value.toFixed(2)).toString();
}

export default function EngineeringPlot({ plot }) {
  const normalized = normalizePlot(plot);
  if (!normalized) return null;

  const points = normalized.series.flatMap((series) => series.points);
  let xMin = Math.min(...points.map((point) => point.x));
  let xMax = Math.max(...points.map((point) => point.x));
  let yMin = Math.min(...points.map((point) => point.y));
  let yMax = Math.max(...points.map((point) => point.y));
  if (xMin === xMax) [xMin, xMax] = [xMin - 1, xMax + 1];
  if (yMin === yMax) [yMin, yMax] = [yMin - 1, yMax + 1];
  const yPadding = (yMax - yMin) * 0.08;
  yMin -= yPadding;
  yMax += yPadding;

  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const x = (value) => MARGIN.left + ((value - xMin) / (xMax - xMin)) * plotWidth;
  const y = (value) => MARGIN.top + plotHeight - ((value - yMin) / (yMax - yMin)) * plotHeight;

  return (
    <section className="plot-card" aria-label={normalized.title}>
      <div className="visual-card-heading">
        <div><p className="eyebrow">Live relationship</p><h3>{normalized.title}</h3></div>
        <div className="plot-legend">
          {normalized.series.map((series) => <span key={series.label}><i style={{ background: series.color }} />{series.label}</span>)}
        </div>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={`${normalized.id}-title ${normalized.id}-desc`}>
        <title id={`${normalized.id}-title`}>{normalized.title}</title>
        <desc id={`${normalized.id}-desc`}>{normalized.yLabel} plotted against {normalized.xLabel}</desc>
        {ticks(yMin, yMax).map((tick) => (
          <g key={`y-${tick}`}>
            <line className="plot-grid" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} />
            <text className="plot-tick" x={MARGIN.left - 10} y={y(tick) + 4} textAnchor="end">{formatTick(tick)}</text>
          </g>
        ))}
        {ticks(xMin, xMax).map((tick) => (
          <g key={`x-${tick}`}>
            <line className="plot-grid" x1={x(tick)} x2={x(tick)} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} />
            <text className="plot-tick" x={x(tick)} y={HEIGHT - MARGIN.bottom + 22} textAnchor="middle">{formatTick(tick)}</text>
          </g>
        ))}
        <text className="plot-axis-label" x={MARGIN.left + plotWidth / 2} y={HEIGHT - 12} textAnchor="middle">{normalized.xLabel}</text>
        <text className="plot-axis-label" transform={`translate(18 ${MARGIN.top + plotHeight / 2}) rotate(-90)`} textAnchor="middle">{normalized.yLabel}</text>
        {normalized.series.map((series) => (
          <g key={series.label}>
            <polyline fill="none" stroke={series.color} strokeWidth="4" strokeLinejoin="round" points={series.points.map((point) => `${x(point.x)},${y(point.y)}`).join(" ")} />
            {series.points.map((point) => <circle key={`${point.x}-${point.y}`} cx={x(point.x)} cy={y(point.y)} r="5" fill={series.color} />)}
          </g>
        ))}
      </svg>
    </section>
  );
}
