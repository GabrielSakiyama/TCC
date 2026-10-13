type ValuesEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

export function ValuesEditor({ value, onChange }: ValuesEditorProps) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Valores usados no gráfico (separe por vírgula, espaço ou ponto e vírgula)
            </span>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Ex.: 42, 58, 51, 37, 63"
                rows={2}
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
            />
        </label>
    );
}
