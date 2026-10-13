"use client";

import { useState } from "react";
import { SamplingDemo } from "@/src/components/amostragem/SamplingDemo";
import { InfoPage } from "@/src/components/amostragem/InfoPage";

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
