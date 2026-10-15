import { HouseIcon } from "@/src/assets/icons/HouseIcon";
import { chartColors, population } from "@/src/data/population";

type SamplePanelProps = {
    sampled: number[];
    sampleAverage: number;
    onToggleIndividual: (index: number) => void;
};

export function SamplePanel({ sampled, sampleAverage, onToggleIndividual }: SamplePanelProps) {
    return (
        <div className="rounded-2xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-200/60">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold">Amostra</p>
                    <p className="text-xs text-blue-200">n = {sampled.length} indivíduos</p>
                </div>
                <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold">
                    {Math.round((sampled.length / population.length) * 100)}%
                </span>
            </div>

            {sampled.length ? (
                <div className="grid grid-cols-3 gap-2.5">
                    {sampled.map((populationIndex, order) => (
                        <button
                            key={populationIndex}
                            type="button"
                            onClick={() => onToggleIndividual(populationIndex)}
                            title="Clique para remover da amostra"
                            className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/20 bg-white transition hover:bg-blue-50"
                        >
                            <HouseIcon color={chartColors[order % chartColors.length]} />
                            <span className="mt-0.5 text-[10px] font-bold text-slate-700">
                                {population[populationIndex]}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-blue-300/50 bg-blue-700/30 px-3 text-center text-xs text-blue-100">
                    Clique nos indivíduos à esquerda para montar a amostra.
                </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                <span className="text-xs text-blue-200">Média da amostra</span>
                <span className="text-lg font-bold">
                    {sampled.length ? sampleAverage.toFixed(2).replace(".", ",") : "—"}
                </span>
            </div>
        </div>
    );
}
