import { chartColors } from "@/src/data/population";
import type { LinearRegression } from "@/src/types/statistics";

type RegressionChartProps = {
    values: number[];
    regression: LinearRegression | null;
};

export function RegressionChart({ values, regression }: RegressionChartProps) {
    const chartWidth = 640;
    const chartHeight = 220;
    const left = 52;
    const right = 590;
    const top = 32;
    const bottom = 190;

    const lineStartValue = regression ? regression.intercept + regression.slope : null;
    const lineEndValue = regression
        ? regression.intercept + regression.slope * values.length
        : null;
    const valuesForScale = [
        ...values,
        ...(lineStartValue === null ? [] : [lineStartValue]),
        ...(lineEndValue === null ? [] : [lineEndValue]),
    ];
    const minValue = valuesForScale.length ? Math.min(...valuesForScale) : 0;
    const maxValue = valuesForScale.length ? Math.max(...valuesForScale) : 10;
    const padding = Math.max((maxValue - minValue) * 0.2, 2);
    const yMin = minValue - padding;
    const yMax = maxValue + padding;

    const chartX = (index: number) =>
        values.length <= 1
            ? (left + right) / 2
            : left + (index * (right - left)) / (values.length - 1);
    const chartY = (value: number) =>
        bottom - ((value - yMin) / (yMax - yMin)) * (bottom - top);
    const regressionStartY = regression
        ? chartY(regression.intercept + regression.slope)
        : 0;
    const regressionEndY = regression
        ? chartY(regression.intercept + regression.slope * values.length)
        : 0;

    return (
        <div className="relative bg-gradient-to-b from-slate-50/60 to-white px-2 pb-2 pt-3 sm:px-4">
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-auto min-h-[190px] w-full"
                role="img"
                aria-label="Gráfico de dispersão e linha de regressão linear"
            >
                {[0, 0.5, 1].map((fraction) => {
                    const value = yMin + (yMax - yMin) * fraction;
                    const y = chartY(value);
                    return (
                        <g key={fraction}>
                            <line x1={left} x2={right} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 5" />
                            <text x="42" y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                                {value.toFixed(1).replace(".", ",")}
                            </text>
                        </g>
                    );
                })}

                <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="#cbd5e1" />
                <line x1={left} y1={top} x2={left} y2={bottom} stroke="#cbd5e1" />

                {values.map((_, index) => (
                    <g key={`x-${index}`}>
                        <line x1={chartX(index)} y1={bottom} x2={chartX(index)} y2={bottom + 4} stroke="#94a3b8" />
                        <text x={chartX(index)} y={bottom + 17} textAnchor="middle" fontSize="10" fill="#94a3b8">
                            {index + 1}
                        </text>
                    </g>
                ))}

                {values.length >= 2 && regression && (
                    <line
                        x1={chartX(0)}
                        y1={regressionStartY}
                        x2={chartX(values.length - 1)}
                        y2={regressionEndY}
                        stroke="#7c3aed"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                )}

                {values.map((value, index) => (
                    <g key={`point-${index}`}>
                        <circle cx={chartX(index)} cy={chartY(value)} r="9" fill={chartColors[index % chartColors.length]} fillOpacity="0.14" />
                        <circle cx={chartX(index)} cy={chartY(value)} r="5" fill={chartColors[index % chartColors.length]} stroke="white" strokeWidth="2" />
                        <text x={chartX(index)} y={chartY(value) - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                            {value}
                        </text>
                    </g>
                ))}

                {!values.length && (
                    <g>
                        <circle cx="320" cy="95" r="24" fill="#f1f5f9" />
                        <path d="m312 95 5 5 11-12" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="320" y="135" textAnchor="middle" fontSize="11" fill="#94a3b8">
                            Selecione indivíduos ou digite valores
                        </text>
                    </g>
                )}

                <text x="320" y="218" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                    Ordem dos valores
                </text>
                <text x="12" y="112" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b" transform="rotate(-90 12 112)">
                    Valor observado
                </text>
            </svg>
        </div>
    );
}
