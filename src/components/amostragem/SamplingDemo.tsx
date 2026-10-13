"use client";

import { useState } from "react";
import { PopulationGrid } from "@/src/components/amostragem/PopulationGrid";
import { SamplePanel } from "@/src/components/amostragem/SamplePanel";
import { RegressionPanel } from "@/src/components/amostragem/RegressionPanel";
import { population } from "@/src/data/population";
import { applyRegressionCoefficients, calculateLinearRegression, parseNumericValues } from "@/src/utils/statistics";

export function SamplingDemo() {
    const [sampled, setSampled] = useState<number[]>([]);
    const [manualValuesText, setManualValuesText] = useState("");
    const [slopeInput, setSlopeInput] = useState<string | null>(null);
    const [interceptInput, setInterceptInput] = useState<string | null>(null);

    const sampleValues = sampled.map((index) => population[index]);
    const chartValues = parseNumericValues(manualValuesText);
    const sampleAverage = sampleValues.length
        ? sampleValues.reduce((total, value) => total + value, 0) / sampleValues.length
        : 0;
    const calculatedRegression = calculateLinearRegression(chartValues);
    const regression = applyRegressionCoefficients(
        chartValues,
        calculatedRegression,
        slopeInput,
        interceptInput,
    );

    const toggleIndividual = (index: number) => {
        const nextSample = sampled.includes(index)
            ? sampled.filter((item) => item !== index)
            : [...sampled, index];

        setSampled(nextSample);
        setManualValuesText(nextSample.map((item) => population[item]).join(", "));
    };

    const resetSample = () => {
        setSampled([]);
        setManualValuesText("");
        setSlopeInput(null);
        setInterceptInput(null);
    };

    return (
        <section className="min-w-0">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
                        Demonstração interativa
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Da população para a amostra</h2>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                        Clique nos indivíduos para adicioná-los ou removê-los da amostra. O gráfico acompanha as alterações.
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
                <PopulationGrid sampled={sampled} onToggleIndividual={toggleIndividual} />

                <div className="sampling-route flex items-center justify-center gap-2 py-1 text-blue-500 lg:w-16 lg:flex-col">
                    <span className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 lg:block">seleção</span>
                    <div className="h-px flex-1 border-t-2 border-dashed border-blue-200 lg:h-14 lg:w-px lg:flex-none lg:border-l-2 lg:border-t-0" />
                    <svg className="h-5 w-5 rotate-0 lg:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <SamplePanel sampled={sampled} sampleAverage={sampleAverage} onToggleIndividual={toggleIndividual} />
            </div>

            <RegressionPanel
                chartValues={chartValues}
                manualValuesText={manualValuesText}
                onManualValuesChange={setManualValuesText}
                calculatedRegression={calculatedRegression}
                regression={regression}
                slopeInput={slopeInput}
                interceptInput={interceptInput}
                onSlopeChange={setSlopeInput}
                onInterceptChange={setInterceptInput}
            />

            <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
                </svg>
                <p>
                    <strong>Amostragem:</strong> selecione os indivíduos que desejar para compor a amostra. Os valores selecionados são usados inicialmente no gráfico, mas você também pode editá-los manualmente.
                </p>
            </div>
        </section>
    );
}
