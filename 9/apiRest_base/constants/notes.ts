// el nombre de la coleccion de firebase
export const NOTES_COLLECTION = "note";

export interface Note {
    id: string;
    text: string;
    author: string;
    done: boolean;
    createdAt: number;
}