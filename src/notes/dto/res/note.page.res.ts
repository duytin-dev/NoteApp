import { NoteResponse } from "./note.res";

export class NotePaginate {
    data: NoteResponse[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;

}