import { atom } from "recoil";
import { Note } from "./types";

export const noteAtom = atom({
  key: "noteAtom", 
  default: {}
});
export const notesAtom = atom<Note[]>({
  key: "notesAtom",
  default: [],
});
export const renderTriggerState = atom({
  key: 'renderTriggerState',
  default: 0, 
});