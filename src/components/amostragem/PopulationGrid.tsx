import { HouseIcon } from "@/src/assets/icons/HouseIcon";
import { chartColors, population } from "@/src/data/population";

type PopulationGridProps = {
    sampled: number[];
    onToggleIndividual: (index: number) => void;
};

export function PopulationGrid({ sampled, onToggleIndividual }: PopulationGridProps) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-800">População</p>
                    <p className="text-xs text-slate-400">N = {population.length} indivíduos</p>
                </div>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {Math.round((sampled.length / population.length) * 100)}%
                </span>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
                {population.map((value, index) => {
                    const isSelected = sampled.includes(index);
                    const selectionOrder = sampled.indexOf(index);
                    const color = chartColors[selectionOrder % chartColors.length];

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => onToggleIndividual(index)}
                            aria-pressed={isSelected}
                            className={`population-person relative flex aspect-square flex-col items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                isSelected
                                    ? "border-blue-200 bg-blue-50 shadow-sm"
                                    : "border-transparent bg-slate-50 hover:bg-slate-100"
                            }`}
                            title={`Indivíduo ${index + 1}: valor ${value}. Clique para ${isSelected ? "remover" : "adicionar"} à amostra`}
                        >
                            <HouseIcon color={isSelected ? color : "#94a3b8"} />
                            <span className={`mt-1 text-[10px] font-bold ${isSelected ? "text-slate-700" : "text-slate-400"}`}>
                                {value}
                            </span>
                            {isSelected && (
                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
