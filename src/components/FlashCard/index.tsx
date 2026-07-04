interface cardProps{
    pergunta: string,
    secao: string
}

export default function FlashCard({secao,pergunta}: cardProps){
    return (
        <section className="rounded-2xl border border-gray-400 h-56 w-32 text-center bg-white">
            <h5>{secao}</h5>
            <hr className="bg-mauve-300 border-0 h-0.5"/>
            
            <p className="p-3 mt">
                {pergunta}
            </p>
        </section>
    )
}