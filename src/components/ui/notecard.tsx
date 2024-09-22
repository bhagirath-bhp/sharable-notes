import { Delete, Lock, Pin, PinOff, Unlock } from "lucide-react";
import { Note } from "@/types";
import { decryptNote, deleteNote, encryptNote, togglePin, saveSingleNote, wrapText } from "@/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useSetRecoilState } from "recoil";
import { noteAtom, renderTriggerState } from "@/recoil";
import MouseIcon from "@/components/ui/mouse-icon";

const NoteCard = (props: {note: Note}) => {
  const [isEncryptDialogOpen, setIsEncryptDialogOpen] = useState(false);
  const [isDecryptDialogOpen, setIsDecryptDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const setNote = useSetRecoilState<Note>(noteAtom); 
  const setRenderTrigger = useSetRecoilState(renderTriggerState);

  const handleEncryption = async () => {
    if (props.note.nid) {
      try {
        const response = await encryptNote(password, props.note.nid);
        if (response.success) {
          toast(response.message);
          saveSingleNote(response.data);
        }
      } catch (error) {
        console.error("Encryption error:", error);
        toast("Encryption failed.");
      }
    }
    setPassword('');
    setRenderTrigger((prev) => prev+1)
    setIsEncryptDialogOpen(false);
  };

  const handleDecryption = async () => {
    if (props.note.nid) {
      try {
        const response = await decryptNote(password, props.note.nid);
        console.log(response)
        if (response.success) {
          toast(response.message);
          saveSingleNote(response.data);
        }
      } catch (error) {
        toast("Decryption failed.");
        console.error("Decryption error:", error);
      }
    }
    setPassword('');
    setRenderTrigger((prev) => prev+1)
    setIsDecryptDialogOpen(false);
  };

  return (
    <div onClick={() => setNote(props.note)} >
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="p-6 min-w-[10rem] border rounded-lg shadow flex justify-between items-center">
            <div>
              <h5 className="mb-2 text-xl font-bold tracking-tight">
                {props.note.encrypted ? "Encrypted" : wrapText(props.note.text, 15) || "undefined"}
              </h5>
              <p>
                {props.note.encrypted ? "Encrypted" : wrapText(props.note.text, 20) || "undefined"}
              </p>
            </div>
            <MouseIcon/>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {!props.note.encrypted && (
            <ContextMenuItem className="flex justify-start gap-5" onClick={() => setIsEncryptDialogOpen(true)}>
              <Lock size={20} /> Encrypt
            </ContextMenuItem>
          )}
          {props.note.encrypted && (
            <ContextMenuItem className="flex justify-start gap-5" onClick={() => setIsDecryptDialogOpen(true)}>
              <Unlock size={20} /> Decrypt
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => {togglePin("notes", props.note.nid); setRenderTrigger((prev) => prev+1)}}>
            {!props.note.pinned ? (<div className="flex justify-start gap-5" ><Pin size={20} /> Pin</div>) : (<div className="flex justify-start gap-5" ><PinOff size={20} /> Unpin</div>) }
          </ContextMenuItem>
          <ContextMenuItem className="flex justify-start gap-5" onClick={() => {deleteNote("notes", props.note.nid); setRenderTrigger((prev) => prev+1)}}>
            <Delete size={20} /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={isEncryptDialogOpen} onOpenChange={setIsEncryptDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Password to Encrypt</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="encrypt-password" className="text-right">Password</Label>
              <Input
                id="encrypt-password"
                className="col-span-3"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleEncryption}>Encrypt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDecryptDialogOpen} onOpenChange={setIsDecryptDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Password to Decrypt</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="decrypt-password" className="text-right">Password</Label>
              <Input
                id="decrypt-password"
                className="col-span-3"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleDecryption}>Decrypt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default NoteCard;
