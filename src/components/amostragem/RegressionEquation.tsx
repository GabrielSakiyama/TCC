import { formatRegressionEquation } from "@/src/utils/statistics";
import type { LinearRegression, RegressionCoefficients } from "@/src/types/statistics";

type RegressionEquationProps = {
    calculatedRegression: RegressionCoefficients | null;
    regression: LinearRegression | null;
    slopeInput: string | null;
    interceptInput: string | null;
    onSlopeChange: (value: string) => void;
    onInterceptChange: (value: string) => void;
};

export function RegressionEquation({
    calculatedRegression,
    regression,
    slopeInput,
    interceptInput,
    onSlopeChange,
    onInterceptChange,
}: RegressionEquationProps) {
    return (
        <div className="flex items-center gap-4 text-xs">
            <div>
                <span className="text-slate-400">Função calculada</span>
                {regression && calculatedRegression ? (
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex flex-wrap items-center gap-1 font-bold text-slate-700">
                            <span>ŷ =</span>
                            <input
                                aria-label="Coeficiente angular da função"
                                title="Edite o coeficiente angular (a)"
                                type="number"
                                step="any"
                                value={slopeInput ?? calculatedRegression.slope.toFixed(2)}
                                onChange={(event) => onSlopeChange(event.target.value)}
                                className="w-[84px] rounded-md border border-violet-200 bg-violet-50 px-1.5 py-1 text-center text-xs font-bold text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />
                            <span>x +</span>
                            <input
                                aria-label="Coeficiente linear da função"
                                title="Edite o coeficiente linear (b)"
                                type="number"
                                step="any"
                                value={interceptInput ?? calculatedRegression.intercept.toFixed(2)}
                                onChange={(event) => onInterceptChange(event.target.value)}
                                className="w-[84px] rounded-md border border-violet-200 bg-violet-50 px-1.5 py-1 text-center text-xs font-bold text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            />
                        </div>
                        <p className="rounded-md bg-violet-50 px-2 py-1.5 text-xs font-semibold text-violet-800">
                            Função completa: {formatRegressionEquation(regression)}
                        </p>
                    </div>
                ) : (
                    <p className="font-bold text-slate-700">Informe pelo menos 2 valores</p>
                )}
            </div>

            <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400">R²</span>
                <p className="font-bold text-violet-600">
                    {regression ? regression.rSquared.toFixed(3) : "—"}
                </p>
            </div>
        </div>
    );
}
