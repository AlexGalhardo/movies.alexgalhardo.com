import { TOTAL_MOVIES_PER_PAGE } from "./envs";
import type { Movie } from "../repositories/movies.repository";

export function paginateIterateFromIndex(movies: Movie[], pageOffset: number): Movie[] {
    const newOffset = (pageOffset * TOTAL_MOVIES_PER_PAGE) % movies.length;
    const arrayFromOffeset: Movie[] = [];

    for (let i = newOffset; i < Number(newOffset + TOTAL_MOVIES_PER_PAGE); i++) {
        if (movies[i]) arrayFromOffeset.push(movies[i]);
        if (!movies[i]) break;
    }

    return arrayFromOffeset;
}
