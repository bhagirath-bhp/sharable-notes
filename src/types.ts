export interface Note {
  title?: string;
  text?: string;
  html?: string;
  nid?: string;
  pinned?: boolean;
  encrypted?: boolean;
  iv?: Uint8Array;
}
