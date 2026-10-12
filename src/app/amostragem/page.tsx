"use client";

import { useState } from "react";

const population = [
    42, 58, 51, 37, 63, 46, 55, 49, 61, 44,
    53, 39, 57, 48, 65, 41, 59, 52, 47, 62,
];

const colors = ["#2563eb", "#0d9488", "#7c3aed", "#db2777", "#ea580c", "#0891b2"];

type Flight = {
    id: number;
    left: number;
    top: number;
    x: number;
    y: number;
    color: string;
    delay: number;
};

function PersonIcon({ color = "currentColor" }: { color?: string }) {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <circle cx="12" cy="7" r="3.25" fill={color} />
            <path
                d="M5.7 19.2c.45-4.1 2.55-6.15 6.3-6.15s5.85 2.05 6.3 6.15"
                stroke={color}
                strokeWidth="2.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function SamplingDemo() {
    const [sampled, setSampled] = useState<number[]>([]);
    const [manualValuesText, setManualValuesText] = useState("");
    const [slopeInput, setSlopeInput] = useState<string | null>(null);
    const [interceptInput, setInterceptInput] = useState<string | null>(null);

    const sampleValues = sampled.map((index) => population[index]);

    const chartValues = manualValuesText
        .split(/[,;\s]+/)
        .map((value) => value.trim())
        .filter(Boolean)
        .map(Number)
        .filter(Number.isFinite);

    const sampleAverage = sampleValues.length
        ? sampleValues.reduce((total, value) => total + value, 0) / sampleValues.length
        : 0;

    const calculatedRegression = (() => {
        if (chartValues.length < 2) return null;

        const points = chartValues.map((y, index) => ({ x: index + 1, y }));

        const meanX =
            points.reduce((total, point) => total + point.x, 0) / points.length;

        const meanY =
            points.reduce((total, point) => total + point.y, 0) / points.length;

        const numerator = points.reduce(
            (total, point) =>
                total + (point.x - meanX) * (point.y - meanY),
            0,
        );

        const denominator = points.reduce(
            (total, point) => total + (point.x - meanX) ** 2,
            0,
        );

        const slope = denominator ? numerator / denominator : 0;
        const intercept = meanY - slope * meanX;

        return { slope, intercept };
    })();

    const regression = calculatedRegression
        ? (() => {
            const slope =
                slopeInput === null
                    ? calculatedRegression.slope
                    : Number(slopeInput || 0);

            const intercept =
                interceptInput === null
                    ? calculatedRegression.intercept
                    : Number(interceptInput || 0);

            const meanY =
                chartValues.reduce((total, value) => total + value, 0) /
                chartValues.length;

            const totalVariation = chartValues.reduce(
                (total, value) => total + (value - meanY) ** 2,
                0,
            );

            const residualVariation = chartValues.reduce(
                (total, value, index) =>
                    total + (value - (slope * (index + 1) + intercept)) ** 2,
                0,
            );

            return {
                slope,
                intercept,
                rSquared: totalVariation
                    ? 1 - residualVariation / totalVariation
                    : 1,
            };
        })()
        : null;

    const toggleIndividual = (index: number) => {
        const nextSample = sampled.includes(index)
            ? sampled.filter((item) => item !== index)
            : [...sampled, index];

        setSampled(nextSample);

        setManualValuesText(
            nextSample.map((item) => population[item]).join(", "),
        );
    };

    const resetSample = () => {
        setSampled([]);
        setManualValuesText("");
        setSlopeInput(null);
        setInterceptInput(null);
    };

    const chartWidth = 640;
    const chartHeight = 220;
    const left = 52;
    const right = 590;
    const top = 32;
    const bottom = 190;

    const lineStartValue = regression
        ? regression.intercept + regression.slope
        : null;
    const lineEndValue = regression
        ? regression.intercept + regression.slope * chartValues.length
        : null;

    const valuesForScale = [
        ...chartValues,
        ...(lineStartValue === null ? [] : [lineStartValue]),
        ...(lineEndValue === null ? [] : [lineEndValue]),
    ];

    const minValue = valuesForScale.length ? Math.min(...valuesForScale) : 0;
    const maxValue = valuesForScale.length ? Math.max(...valuesForScale) : 10;

    const padding = Math.max((maxValue - minValue) * 0.2, 2);
    const yMin = minValue - padding;
    const yMax = maxValue + padding;

    const chartX = (index: number) =>
        chartValues.length <= 1
            ? (left + right) / 2
            : left + (index * (right - left)) / (chartValues.length - 1);

    const chartY = (value: number) =>
        bottom - ((value - yMin) / (yMax - yMin)) * (bottom - top);

    const regressionStartY = regression
        ? chartY(regression.intercept + regression.slope)
        : 0;

    const regressionEndY = regression
        ? chartY(
            regression.intercept +
            regression.slope * chartValues.length,
        )
        : 0;

    return (
        <section className="min-w-0">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
                        Demonstração interativa
                    </span>

                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Da população para a amostra
                    </h2>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                        Clique nos indivíduos para adicioná-los ou removê-los
                        da amostra. O gráfico acompanha as alterações.
                    </p>
                </div>

                <button
                    onClick={resetSample}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    Limpar amostra
                </button>
            </div>

            <div className="sampling-stage grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 lg:grid-cols-[1.35fr_auto_0.8fr] lg:items-center lg:p-6">
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-800">
                                População
                            </p>
                            <p className="text-xs text-slate-400">
                                N = {population.length} indivíduos
                            </p>
                        </div>

                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                            {Math.round(
                                (sampled.length / population.length) * 100,
                            )}
                            %
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2.5">
                        {population.map((value, index) => {
                            const isSelected = sampled.includes(index);
                            const selectionOrder = sampled.indexOf(index);
                            const color = colors[selectionOrder % colors.length];

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => toggleIndividual(index)}
                                    aria-pressed={isSelected}
                                    className={`population-person relative flex aspect-square flex-col items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                        isSelected
                                            ? "border-blue-200 bg-blue-50 shadow-sm"
                                            : "border-transparent bg-slate-50 hover:bg-slate-100"
                                    }`}
                                    title={`Indivíduo ${index + 1}: valor ${value}. Clique para ${
                                        isSelected ? "remover" : "adicionar"
                                    } à amostra`}
                                >
                                    <PersonIcon
                                        color={isSelected ? color : "#94a3b8"}
                                    />

                                    <span
                                        className={`mt-1 text-[10px] font-bold ${
                                            isSelected
                                                ? "text-slate-700"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {value}
                                    </span>

                                    {isSelected && (
                                        <span
                                            className="absolute right-1 top-1 h-2 w-2 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="sampling-route flex items-center justify-center gap-2 py-1 text-blue-500 lg:w-16 lg:flex-col">
                    <span className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 lg:block">
                        seleção
                    </span>

                    <div className="h-px flex-1 border-t-2 border-dashed border-blue-200 lg:h-14 lg:w-px lg:flex-none lg:border-l-2 lg:border-t-0" />

                    <svg
                        className="h-5 w-5 rotate-0 lg:rotate-90"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path
                            d="m9 18 6-6-6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div className="rounded-2xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-200/60">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold">Amostra</p>
                            <p className="text-xs text-blue-200">
                                n = {sampled.length} indivíduos
                            </p>
                        </div>

                        <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold">
                            {Math.round(
                                (sampled.length / population.length) * 100,
                            )}
                            %
                        </span>
                    </div>

                    {sampled.length ? (
                        <div className="grid grid-cols-3 gap-2.5">
                            {sampled.map((populationIndex, order) => (
                                <button
                                    key={populationIndex}
                                    type="button"
                                    onClick={() =>
                                        toggleIndividual(populationIndex)
                                    }
                                    title="Clique para remover da amostra"
                                    className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/20 bg-white transition hover:bg-blue-50"
                                >
                                    <PersonIcon
                                        color={colors[order % colors.length]}
                                    />

                                    <span className="mt-0.5 text-[10px] font-bold text-slate-700">
                                        {population[populationIndex]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-blue-300/50 bg-blue-700/30 px-3 text-center text-xs text-blue-100">
                            Clique nos indivíduos à esquerda para montar a
                            amostra.
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                        <span className="text-xs text-blue-200">
                            Média da amostra
                        </span>

                        <span className="text-lg font-bold">
                            {sampled.length
                                ? sampleAverage.toFixed(2).replace(".", ",")
                                : "—"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            d="M4 19V5M4 19h16"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="m7 16 4-5 3 2 5-7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>

                                <h3 className="text-sm font-bold text-slate-800">
                                    Gráfico e função de regressão
                                </h3>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                                Edite os valores do gráfico abaixo ou clique nos
                                coeficientes da equação para alterar a reta.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                            <div>
                                <span className="text-slate-400">
                                    Função calculada
                                </span>

                                {regression ? (
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="flex flex-wrap items-center gap-1 font-bold text-slate-700">
                                            <span>Valor 1</span>

                                            <input
                                                aria-label="Coeficiente angular da função"
                                                title="Edite o coeficiente angular (a)"
                                                type="number"
                                                step="any"
                                                value={
                                                    slopeInput ??
                                                    calculatedRegression!.slope.toFixed(2)
                                                }
                                                onChange={(event) =>
                                                    setSlopeInput(event.target.value)
                                                }
                                                className="w-[84px] rounded-md border border-violet-200 bg-violet-50 px-1.5 py-1 text-center text-xs font-bold text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                            />

                                            <span>Valor 2</span>

                                            <input
                                                aria-label="Coeficiente linear da função"
                                                title="Edite o coeficiente linear (b)"
                                                type="number"
                                                step="any"
                                                value={
                                                    interceptInput ??
                                                    calculatedRegression!.intercept.toFixed(2)
                                                }
                                                onChange={(event) =>
                                                    setInterceptInput(event.target.value)
                                                }
                                                className="w-[84px] rounded-md border border-violet-200 bg-violet-50 px-1.5 py-1 text-center text-xs font-bold text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                            />
                                        </div>

                                        <p className="rounded-md bg-violet-50 px-2 py-1.5 text-xs font-semibold text-violet-800">
                                            y = {regression.slope.toFixed(2)}x {regression.intercept < 0 ? "−" : "+"} {Math.abs(regression.intercept).toFixed(2)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="font-bold text-slate-700">
                                        Informe pelo menos 2 valores
                                    </p>
                                )}
                            </div>

                            <div className="border-l border-slate-200 pl-4">
                                <span className="text-slate-400">R²</span>

                                <p className="font-bold text-violet-600">
                                    {regression
                                        ? regression.rSquared.toFixed(3)
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                            Valores usados no gráfico (separe por vírgula,
                            espaço ou ponto e vírgula)
                        </span>

                        <textarea
                            value={manualValuesText}
                            onChange={(event) =>
                                setManualValuesText(event.target.value)
                            }
                            placeholder="Ex.: 42, 58, 51, 37, 63"
                            rows={2}
                            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                        />
                    </label>
                </div>

                <div className="relative bg-gradient-to-b from-slate-50/60 to-white px-2 pb-2 pt-3 sm:px-4">
                    <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        className="h-auto min-h-[190px] w-full"
                        role="img"
                        aria-label="Gráfico de dispersão e linha de regressão linear"
                    >
                        {[0, 0.5, 1].map((fraction) => {
                            const value =
                                yMin + (yMax - yMin) * fraction;
                            const y = chartY(value);

                            return (
                                <g key={fraction}>
                                    <line
                                        x1={left}
                                        x2={right}
                                        y1={y}
                                        y2={y}
                                        stroke="#e2e8f0"
                                        strokeDasharray="4 5"
                                    />

                                    <text
                                        x="42"
                                        y={y + 4}
                                        textAnchor="end"
                                        fontSize="10"
                                        fill="#94a3b8"
                                    >
                                        {value.toFixed(1).replace(".", ",")}
                                    </text>
                                </g>
                            );
                        })}

                        <line
                            x1={left}
                            y1={bottom}
                            x2={right}
                            y2={bottom}
                            stroke="#cbd5e1"
                        />

                        <line
                            x1={left}
                            y1={top}
                            x2={left}
                            y2={bottom}
                            stroke="#cbd5e1"
                        />

                        {chartValues.map((_, index) => (
                            <g key={`x-${index}`}>
                                <line
                                    x1={chartX(index)}
                                    y1={bottom}
                                    x2={chartX(index)}
                                    y2={bottom + 4}
                                    stroke="#94a3b8"
                                />

                                <text
                                    x={chartX(index)}
                                    y={bottom + 17}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#94a3b8"
                                >
                                    {index + 1}
                                </text>
                            </g>
                        ))}

                        {chartValues.length >= 2 && regression && (
                            <line
                                x1={chartX(0)}
                                y1={regressionStartY}
                                x2={chartX(chartValues.length - 1)}
                                y2={regressionEndY}
                                stroke="#7c3aed"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        )}

                        {chartValues.map((value, index) => (
                            <g key={`point-${index}`}>
                                <circle
                                    cx={chartX(index)}
                                    cy={chartY(value)}
                                    r="9"
                                    fill={colors[index % colors.length]}
                                    fillOpacity="0.14"
                                />

                                <circle
                                    cx={chartX(index)}
                                    cy={chartY(value)}
                                    r="5"
                                    fill={colors[index % colors.length]}
                                    stroke="white"
                                    strokeWidth="2"
                                />

                                <text
                                    x={chartX(index)}
                                    y={chartY(value) - 12}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill="#475569"
                                >
                                    {value}
                                </text>
                            </g>
                        ))}

                        {!chartValues.length && (
                            <g>
                                <circle
                                    cx="320"
                                    cy="95"
                                    r="24"
                                    fill="#f1f5f9"
                                />

                                <path
                                    d="m312 95 5 5 11-12"
                                    fill="none"
                                    stroke="#94a3b8"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                <text
                                    x="320"
                                    y="135"
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="#94a3b8"
                                >
                                    Selecione indivíduos ou digite valores
                                </text>
                            </g>
                        )}

                        <text
                            x="320"
                            y="218"
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="#64748b"
                        >
                            Ordem dos valores
                        </text>

                        <text
                            x="12"
                            y="112"
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="#64748b"
                            transform="rotate(-90 12 112)"
                        >
                            Valor observado
                        </text>
                    </svg>
                </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
                <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path
                        d="M12 11v5M12 8h.01"
                        strokeLinecap="round"
                    />
                </svg>

                <p>
                    <strong>Amostragem:</strong> selecione os indivíduos que
                    desejar para compor a amostra. Os valores selecionados são
                    usados inicialmente no gráfico, mas você também pode
                    editá-los manualmente.
                </p>
            </div>
        </section>
    );
}

function InfoPage({ page }: { page: number }) {
    const content =
        page === 1
            ? {
                label: "Como funciona",
                title: "Cada indivíduo precisa ter chance de participar",
                text: "Na amostragem aleatória simples, a escolha não depende da preferência do pesquisador. Isso ajuda a reduzir vieses e torna a amostra mais representativa.",
            }
            : {
                label: "Interpretação",
                title: "A amostra ajuda a estimar a população",
                text: "A média observada na amostra é uma estimativa. Amostras maiores e bem selecionadas tendem a produzir resultados mais próximos do parâmetro real da população.",
            };

    return (
        <section className="flex min-h-[430px] items-center justify-center">
            <div className="max-w-xl text-center">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    {content.label}
                </span>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {content.title}
                </h2>

                <p className="mt-4 text-base leading-7 text-slate-500">
                    {content.text}
                </p>
            </div>
        </section>
    );
}

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [page, setPage] = useState(0);

    const pageLabels = [
        "Demonstração",
        "Método",
        "Interpretação",
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#edf2f8]">
            <header className="relative z-50 flex h-16 items-center border-b border-slate-200/80 bg-white px-4 shadow-sm">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-10 w-10 shrink-0 flex-col justify-center gap-[5px] rounded-lg transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400"
                    aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuOpen}
                >
                    <span
                        className="mx-auto block h-0.5 w-5 rounded bg-slate-800 transition-transform duration-200"
                        style={{
                            transform: menuOpen
                                ? "translateY(7px) rotate(45deg)"
                                : "none",
                        }}
                    />

                    <span
                        className="mx-auto block h-0.5 w-5 rounded bg-slate-800 transition-opacity duration-200"
                        style={{ opacity: menuOpen ? 0 : 1 }}
                    />

                    <span
                        className="mx-auto block h-0.5 w-5 rounded bg-slate-800 transition-transform duration-200"
                        style={{
                            transform: menuOpen
                                ? "translateY(-7px) rotate(-45deg)"
                                : "none",
                        }}
                    />
                </button>

                <div className="flex flex-1 items-center justify-center pr-10">
                    <div className="text-center">
                        <h1 className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-800">
                            Estatística
                        </h1>

                        <p className="hidden text-[10px] text-slate-400 sm:block">
                            Amostragem e população
                        </p>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] transition-opacity duration-200 ${
                    menuOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                onClick={() => setMenuOpen(false)}
            />

            <aside
                className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-white px-4 pb-8 pt-20 shadow-2xl transition-transform duration-200"
                style={{
                    transform: menuOpen
                        ? "translateX(0)"
                        : "translateX(-100%)",
                }}
            >
                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Conteúdo
                </p>

                <nav className="flex flex-col gap-1">
                    {pageLabels.map((item, index) => (
                        <button
                            key={item}
                            onClick={() => {
                                setPage(index);
                                setMenuOpen(false);
                            }}
                            className={`rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${
                                page === index
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            <span className="mr-3 text-xs text-slate-400">
                                0{index + 1}
                            </span>

                            {item}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="flex flex-1 items-start justify-center p-3 sm:p-5 lg:p-7">
                <div
                    className={`grid w-full gap-5 ${
                        page === 0
                            ? "max-w-none xl:grid-cols-2"
                            : "max-w-5xl"
                    }`}
                >
                    <div className="order-2 min-w-0 rounded-3xl bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8 xl:order-2">
                        {page === 0 ? (
                            <SamplingDemo />
                        ) : (
                            <InfoPage page={page} />
                        )}
                    </div>

                    {page === 0 && (
                        <aside className="order-1 flex min-h-[calc(100vh-180px)] min-w-0 flex-col rounded-3xl bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7">
                            <h2 className="text-lg font-bold text-slate-800">
                                Conceitos importantes
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Entenda os conceitos estatísticos utilizados
                                nesta demonstração.
                            </p>

                            <div className="mt-4 flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <h3 className="text-base font-bold text-blue-700">
                                    titulo
                                </h3>
                                texto
                            </div>
                        </aside>
                    )}
                </div>
            </main>

            <footer className="flex items-center justify-center gap-5 px-6 pb-5 pt-1">
                <button
                    onClick={() =>
                        setPage((current) => Math.max(0, current - 1))
                    }
                    disabled={page === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-30"
                    aria-label="Anterior"
                >
                    <svg
                        className="h-[18px] w-[18px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            d="m15 18-6-6 6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className="flex items-center gap-2">
                    {pageLabels.map((label, index) => (
                        <button
                            key={label}
                            onClick={() => setPage(index)}
                            className={`h-2 rounded-full transition-all ${
                                page === index
                                    ? "w-7 bg-blue-600"
                                    : "w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                            aria-label={`Ir para ${label}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() =>
                        setPage((current) =>
                            Math.min(pageLabels.length - 1, current + 1),
                        )
                    }
                    disabled={page === pageLabels.length - 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-30"
                    aria-label="Próximo"
                >
                    <svg
                        className="h-[18px] w-[18px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            d="m9 18 6-6-6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </footer>
        </div>
    );
}
