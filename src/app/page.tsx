import Topo from "@/src/widgets/Topo";
import ButtonNavigation from "../components/ButtonNavigation";
import Sidebar from "@/src/widgets/Sidebar";
import TitleContent from "../components/TitleContent";
import FlashCard from "../components/FlashCard";
import {ArrowBigLeft, BookText} from "@/src/assets/icons";

export default function Home() {
  return (
    <div>
      <header className="flex items-center">
        <Topo/>
      </header>

      <ButtonNavigation child={<ArrowBigLeft/>}/>
    
      <Sidebar/>

      <TitleContent imagem={<BookText/>} titulo="teste"/>

      <FlashCard pergunta="O que é ?" secao="Pergunta 1"/>
    </div>
  );
}
