import slugify from "slugify";

const bestMoviesInfo: any[] = [];

const getBestMoviesInfo = async () => {
    const bestMovies = await Bun.file("./src/repositories/jsons/best-movies.json").json();
    const allGenres: { id: number; name: string }[] = await Bun.file("./src/repositories/jsons/all-genres.json").json();

    const genreSet = new Set(allGenres.map((genre) => genre.id));

    for (let i = 0; i < bestMovies.length; i++) {
        console.log("Processing movie index => ", i);

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${bestMovies[i].id}?api_key=${Bun.env.TMDB_API_KEY}`,
        );

        const {
            id,
            imdb_id,
            original_title,
            title,
            vote_average,
            release_date,
            runtime,
            overview,
            popularity,
            poster_path,
            genres,
        }: any = await response.json();

        genres.forEach((genre: any) => {
            if (!genreSet.has(genre.id)) {
                genreSet.add(genre.id);
                allGenres.push({
                    ...genre,
                    slug: slugify(genre.name, { lower: true, strict: true }),
                });
            }
        });

        bestMoviesInfo.push({
            id,
            imdb_id,
            original_title,
            title,
            slug: slugify(title, { lower: true, strict: true }),
            vote_average,
            release_date,
            runtime,
            overview,
            popularity,
            poster: `https://image.tmdb.org/t/p/original${poster_path}`,
            genres,
        });
    }

    await Bun.write("./src/repositories/jsons/best-movies-info.json", JSON.stringify(bestMoviesInfo, null, 4));
    await Bun.write("./src/repositories/jsons/all-genres.json", JSON.stringify(allGenres, null, 4));
};

getBestMoviesInfo();
