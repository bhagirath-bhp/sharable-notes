import { Note } from "./types";

export function wrapText(text: string | undefined, maxLength: number) {
    if (text && text?.length <= maxLength) {
      return text;
    }
    
    const truncatedText = text?.substring(0, maxLength - 3);
    return truncatedText + '...';
  }

export function pushToLocalStorage<T>(key = "notes", newItem: T): void {
    try {
        const existingItems: T[] = fetchFromLocalStorage(key);
        existingItems.push(newItem);
        localStorage.setItem(key, JSON.stringify(existingItems));
    } catch (error) {
        console.error("Failed to push to local storage:", error);
    }
}

export function saveToLocalStorage<T>(key = "notes", notes: T) {
    try {
        localStorage.setItem(key, JSON.stringify(notes));
        return {success: true, message: "Successfully saved to local storage:"}
    } catch (error) {
        console.error("Failed to save to local storage:", error);
        return {success: false, message: "Failed to save to local storage:"}
    }
}

export function fetchFromLocalStorage<T>(key = "notes"): T[] {
    try {
        const items: T[] = JSON.parse(localStorage.getItem(key) || '[]');
        return items.sort((a, b) => {
            const aPinned = (a as any).pinned ? 1 : 0;
            const bPinned = (b as any).pinned ? 1 : 0;
            return bPinned - aPinned;
        });
    } catch (error) {
        console.error("Failed to fetch from local storage:", error);
        return [];
    }
}

export function fetchNoteWithNID(nid: string, key = "notes") {
    const existingItems: Note[] = fetchFromLocalStorage(key);
    const note = existingItems.find(item => (item as any).nid === nid);
    return note;
}

export function saveSingleNote(note: Note | any, key = "notes") {
    try {
        const existingItems: Note[] = fetchFromLocalStorage(key);
        const noteIndex = existingItems.findIndex(item => (item as any).nid === note.nid);
        if (noteIndex !== -1) {
            existingItems[noteIndex] = note;
            saveToLocalStorage(key, existingItems);
        } else {
            console.warn(`Note with nid ${note.nid} not found.`);
        }
    } catch (error) {
        console.error("Failed to save single note:", error);
    }
}

export function togglePin(key = "notes", nid: string | undefined) {
    try {
        const existingItems: Note[] = fetchFromLocalStorage(key);
        const noteIndex = existingItems.findIndex(item => (item as any).nid === nid);

        if (noteIndex !== -1) {
            const note = existingItems[noteIndex];
            note.pinned = !note.pinned;
            existingItems[noteIndex] = note; 
            saveToLocalStorage(key, existingItems);
        } else {
            console.warn(`Note with nid ${nid} not found.`);
        }
    } catch (error) {
        console.error("Failed to pin note:", error);
    }
}

export function deleteNote(key = "notes", nid: string | undefined) {
    try {
        const existingItems: Note[] = fetchFromLocalStorage(key);
        const updatedItems = existingItems.filter(n => n.nid !== nid);
        saveToLocalStorage(key, updatedItems);
        return { success: true, message: "Note deleted successfully!" };
    } catch (error) {
        console.error("Failed to delete note:", error);
        return { success: false, message: "Failed to delete note." };
    }
}

async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();

    try {
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            "PBKDF2",
            false,
            ["deriveBits", "deriveKey"]
        );

        const key = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: encoder.encode(salt),
                iterations: 10000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );

        return key;
    } catch (error) {
        console.error("Failed to derive key:", error);
        throw error; // Rethrow for higher-level handling
    }
}

function arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function encryptData(key: CryptoKey, data: string, iv: Uint8Array): Promise<string> {
    const encoder = new TextEncoder();

    try {
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encoder.encode(data)
        );

        const uint8Array = new Uint8Array(encryptedData);
        return arrayBufferToBase64(uint8Array); 
    } catch (error) {
        console.error("Failed to encrypt data:", error);
        throw error;
    }
}

async function decryptData(key: CryptoKey, encryptedData: string, iv: Uint8Array): Promise<string> {
    const decryptedDataArray = base64ToArrayBuffer(encryptedData); 

    try {
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            decryptedDataArray
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    } catch (error) {
        console.error("Failed to decrypt data:", error);
        throw error;
    }
}

export async function encryptNote(password: string, nid: string) {
    const note = fetchNoteWithNID(nid);
    const salt = "aahajkj";
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    console.log("IV used for encryption:", [...iv], password, salt);

    try {
        const key = await deriveKey(password, salt);
        console.log("Encryption key derived");

        if (note) {
            const encryptedNote = {
                nid: note.nid,
                title: (note.title) ? await encryptData(key, note.title, iv) : "",
                text: (note.text) ? await encryptData(key, note.text, iv) : "",
                html: (note.html) ? await encryptData(key, note.html, iv) : "",
                pinned: note.pinned,
                encrypted: true,
                iv: [...iv]
            };
            console.log("Encrypted Note:", encryptedNote);
            return { success: true, message: "Note encrypted successfully!", data: encryptedNote };
        } else {
            return { success: false, message: "Note does not exist!" };
        }
    } catch (error) {
        console.error("Failed to encrypt note:", error);
        return { success: false, message: "Encryption failed." };
    }
}

export async function decryptNote(password: string, nid: string) {
    const note = fetchNoteWithNID(nid, "notes");
    const salt = "aahajkj";

    console.log("IV used for decryption:", note?.iv, password, salt);
    
    try {
        const key = await deriveKey(password, salt);
        console.log("Decryption key derived");

        if (note) {
            console.log("Note before decryption:", note, key, note?.iv);
            const decryptedNote = {
                nid: note.nid,
                title: (note.title && note.iv) ? await decryptData(key, note.title, note.iv) : " ",
                text: (note.text && note.iv) ? await decryptData(key, note.text, note.iv) : " ",
                html: (note.html && note.iv) ? await decryptData(key, note.html, note.iv) : " ",
                encrypted: false
            };
            return { success: true, data: decryptedNote };
        } else {
            return { success: false, message: "Note does not exist!" };
        }
    } catch (error) {
        console.error("Failed to decrypt note:", error);
        return { success: false, message: "Decryption failed." };
    }
}



async function testEncryptionDecryption() {
    const password = "testPassword";
    const salt = "aahajkj";
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(password, salt);
    const data = "Hello, World!";
    const encryptedData = await encryptData(key, data, iv);
    
    console.log('Encrypted data:', encryptedData);
    
    const decryptedData = await decryptData(key, encryptedData, iv);
    console.log('Decrypted data:', decryptedData); // test function works
}

testEncryptionDecryption().catch(console.error);
