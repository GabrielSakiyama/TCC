import ContentCourse from "@/src/components/ContentCourse";

export default function Sidebar(){
    return (
        <div className="overflow-auto bg-white rounded-2xl w-1/6 h-40 border-black border-2">
            <ContentCourse titulo="titulo 1" unidade="unidade 1"/>
        </div>
    )
}