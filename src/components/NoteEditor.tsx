import { useEffect, useRef, useState } from "react";
import DynamicSelect from "@/components/ui/dynamic-select";
import { Button } from "@/components/ui/button";
import { richTextOptions } from "@/data";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
} from "lucide-react";
import { fetchFromLocalStorage, saveToLocalStorage } from "@/utils";
import { Note } from "@/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { noteAtom, renderTriggerState } from "@/recoil";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";

const NoteEditor = () => {
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");
  const editor = useRef<HTMLDivElement | any>();
  const setRenderTrigger = useSetRecoilState(renderTriggerState);
  const note: Note = useRecoilValue(noteAtom);
  type Format =
    | "bold"
    | "italic"
    | "underline"
    | "strikethrough"
    | "justifyLeft"
    | "justifyCenter"
    | "justifyRight"
    | "justifyFull"
    | "undo"
    | "redo";
  const [activeFormats, setActiveFormats] = useState<Record<Format, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    undo: false,
    redo: false,
  });

  useEffect(() => {
    if (editor.current && note?.title && note?.html) {
      editor.current.innerHTML = note.html;
      setFileName(note.title);
    }
  }, [note]);

  const handleFormat = (format: string, value?: string | null | undefined) => {
    console.log(`Applying format: ${format}`);
    if (editor.current) {
      editor.current.focus();
      if (value) {
        document.execCommand(format, false, value);
      } else {
        document.execCommand(format, false);
      }
    }
  };

  const handleFile = (value: string) => {
    console.log(`Selected font size: ${value}`);
    if (value === "new" && editor.current) {
      editor.current.innerHTML = "";
      setFileName("undefined");
    } else if (value === "text" && editor.current?.innerText) {
      const blob = new Blob([editor.current?.innerText]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.txt`;
      link.click();
    }
  };

  const handleSave = () => {
    setSaving(true);
    const newNote = {
      title: fileName,
      html: editor.current.innerHTML,
      text: editor.current.innerText,
      nid: note.nid || Math.random().toString(36).substring(7),
      date: new Date().toLocaleDateString(),
    };
    const existingNotes = fetchFromLocalStorage("notes");
    const noteIndex = existingNotes.findIndex(
      (n: any) => n.nid === newNote.nid
    );
    if (noteIndex === -1) {
      existingNotes.push(newNote);
    } else {
      existingNotes[noteIndex] = newNote;
    }
    const response = saveToLocalStorage("notes", existingNotes);
    toast(response.message);
    setTimeout(() => {
      setSaving(false);
      setRenderTrigger((prev) => prev + 1);
    }, 1000);
  };

  const buttonFormats: { format: Format; icon: JSX.Element }[] = [
    { format: "bold", icon: <Bold /> },
    { format: "italic", icon: <Italic /> },
    { format: "underline", icon: <Underline /> },
    { format: "strikethrough", icon: <Strikethrough /> },
    { format: "justifyLeft", icon: <AlignLeft /> },
    { format: "justifyCenter", icon: <AlignCenter /> },
    { format: "justifyRight", icon: <AlignRight /> },
    { format: "justifyFull", icon: <AlignJustify /> },
    { format: "undo", icon: <Undo2 /> },
    { format: "redo", icon: <Redo2 /> },
  ];

  const handleToggleFormat = (format: Format) => {
    setActiveFormats((prev) => {
      const newActiveState = { ...prev, [format]: !prev[format] };
      if (editor.current) {
        editor.current.focus();
        document.execCommand(format, false);
      }
      return newActiveState;
    });
  };
  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-4 flex gap-2">
        <Input
          className="w-min"
          onChange={(e) => {
            setFileName(e.target.value);
          }}
          value={fileName}
        />
        <DynamicSelect
          items={
            richTextOptions.find((option) => option.category === "file")
              ?.options
          }
          placeholder="File"
          onChange={handleFile}
        />
        <DynamicSelect
          items={
            richTextOptions.find((option) => option.category === "fontsize")
              ?.options
          }
          placeholder="Select Font Size"
          onChange={(value) => {
            handleFormat("fontSize", value);
          }}
        />
        <Button onClick={handleSave}>
          <Loader2
            className={`mr-2 h-4 w-4 animate-spin ${
              saving ? "block" : "hidden"
            }`}
          />
          Save
        </Button>
      </div>

      <div className="flex flex-wrap gap-5 mb-4">
        {buttonFormats.map(({ format, icon }, index) => (
          <Button
            key={format}
            variant={(activeFormats[format] && index < 4) ? "default" : "outline"}
            onClick={() => {
              handleToggleFormat(format);
              console.log(`Formatting with: ${format}`); // Handle formatting here
            }}
          >
            {icon}
          </Button>
        ))}
      </div>

      <div
        contentEditable={true}
        className="flex-1 border rounded outline-none p-2"
        spellCheck={false}
        ref={editor}
      ></div>
      <Toaster />
    </div>
  );
};

export default NoteEditor;
