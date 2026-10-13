import type { LinearRegression, RegressionCoefficients } from "@/src/types/statistics";
import { RegressionChart } from "@/src/components/amostragem/RegressionChart";
import { RegressionEquation } from "@/src/components/amostragem/RegressionEquation";
import { ValuesEditor } from "@/src/components/amostragem/ValuesEditor";

type RegressionPanelProps = {
    chartValues: number[];
    manualValuesText: string;
    onManualValuesChange: (value: string) => void;
    calculatedRegression: RegressionCoefficients | null;
    regression: LinearRegression | null;
    slopeInput: string | null;
    interceptInput: string | null;
    onSlopeChange: (value: string) => void;
    onInterceptChange: (value: string) => void;
};

export function RegressionPanel({
    chartValues,
    manualValuesText,
    onManualValuesChange,
    calculatedRegression,
    regression,
    slopeInput,
    interceptInput,
    onSlopeChange,
    onInterceptChange,
}: RegressionPanelProps) {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M4 19V5M4 19h16" strokeLinecap="round" />
                                    <path d="m7 16 4-5 3 2 5-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <h3 className="text-sm font-bold text-slate-800">Gráfico e função de regressão</h3>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Edite os valores do gráfico abaixo ou clique nos coeficientes da equação para alterar a reta.
                        </p>
                    </div>

                    <RegressionEquation
                        calculatedRegression={calculatedRegression}
                        regression={regression}
                        slopeInput={slopeInput}
                        interceptInput={interceptInput}
                        onSlopeChange={onSlopeChange}
                        onInterceptChange={onInterceptChange}
                    />
                </div>

                <ValuesEditor value={manualValuesText} onChange={onManualValuesChange} />
            </div>

            <RegressionChart values={chartValues} regression={regression} />
        </div>
    );
}
