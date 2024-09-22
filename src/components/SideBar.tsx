import { Button } from "@/components/ui/button";
import NoteCard from "@/components/ui/notecard";
import { fetchFromLocalStorage } from "@/utils";
import { useEffect } from "react";
import { Note } from "@/types";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { notesAtom, noteAtom, renderTriggerState } from "@/recoil";

const SideBar = () => {
  const [notes, setNotes] = useRecoilState<Note[]>(notesAtom);
  const setCurrentNote = useSetRecoilState(noteAtom);
  const renderTrigger = useRecoilValue(renderTriggerState);

  useEffect(() => {
    const fetchedNotes = fetchFromLocalStorage<Note>("notes");
    setNotes(fetchedNotes);
  }, [renderTrigger]);

  const handleCreateNote = () => {
    setCurrentNote({ title: " ", text: " ", html: " " });
    console.log("reset");
  };

  const handleSelectNote = (note: Note) => {
    setCurrentNote(note);
    console.log("hii");
  };

  return (
    <div className="flex flex-col h-full items-center px-6 py-3">
      <div className="flex w-full justify-end my-2">
        <Button onClick={handleCreateNote}>Create</Button>
      </div>
      <div className="w-full overflow-y-scroll flex flex-col gap-2 noscrollbar">
        {notes?.map((note, index) => (
          <div className="cursor-pointer" key={index} onClick={() => handleSelectNote(note)}>
            <NoteCard note={note}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
