type InfoPageProps = {
    page: number;
};

export function InfoPage({ page }: InfoPageProps) {
    const content = page === 1
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
