import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "@/components/SideBar";
import { useMediaQuery } from "react-responsive";
import NoteEditor from "@/components/NoteEditor";

const NotesView = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <ResizablePanelGroup direction="horizontal">
      {!isMobile && (
        <ResizablePanel defaultSize={25} minSize={15}>
          <SideBar />
        </ResizablePanel>
      )}
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={isMobile ? 100 : 75} minSize={25}>
        <NoteEditor />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default NotesView;
