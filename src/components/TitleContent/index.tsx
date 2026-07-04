interface tituloProps {
    titulo: string,
    imagem: React.ReactNode
}

export default function TitleContent({titulo, imagem}: tituloProps){
    return (
        <div>
            {imagem}
            {titulo}
        </div>
    )
}