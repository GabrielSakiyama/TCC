import {BookText} from '@/src/assets/icons'
interface cursoProps{
    titulo: string,
    unidade: string
}

export default function ContentCourse({titulo, unidade}:cursoProps){
    return (
        <section className="bg-gray-200 p-3 m-0.5 rounded-md flex items-center">
            <span>
               <BookText className='inline'/> {unidade} - {titulo}
            </span>
        </section>
    )
}