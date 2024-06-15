interface GenreInterface {
    id: number;
    name: string;
}

interface MovieInterface {
    id: number;
    imdb_id: string;
    original_title: string;
    title: string;
    vote_average: number;
    release_date: string;
    runtime: number;
    overview: string;
    popularity: number;
    poster: string;
    genres: GenreInterface[];
}

async function getRecommendedMovies(preferredGenres: number[]): Promise<MovieInterface[] | null> {
    const bestMovies = await Bun.file("./best-movies-info.json").json();

    const filteredMovies = bestMovies.filter((movie: MovieInterface) =>
        movie.genres.some((genre) => preferredGenres.includes(genre.id)),
    );

    filteredMovies.sort((a: any, b: any) => {
        if (b.popularity === a.popularity) {
            return b.vote_average - a.vote_average;
        }
        return b.popularity - a.popularity;
    });

    return filteredMovies.length > 0 ? filteredMovies : null;
}

// Example usage
const userPreferredGenres = [12, 28, 878];
const recommendedMovies = await getRecommendedMovies(userPreferredGenres);

if (recommendedMovies) {
    console.log(`Recommended Movies: `, recommendedMovies);
    console.log("total movies recommended: ", recommendedMovies.length);
} else {
    console.log("No movies found for the selected genres.");
}
