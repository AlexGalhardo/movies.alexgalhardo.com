const getBestMovies = async () => {
    const movies = await Bun.file("./src/repositories/jsons/all-movies.json").json();

    // console.log('movies ', movies);

    const filteredBestMovies = movies
        .filter((movie: any) => movie.popularity >= 100)
        .map((movie: any) => ({
            id: movie.id,
            original_title: movie.original_title,
            popularity: movie.popularity,
        }));

    // console.log(filteredMovies);

    console.log("total best movies => ", filteredBestMovies.length);

    await Bun.write("./src/repositories/jsons/best-movies.json", JSON.stringify(filteredBestMovies, null, 4));
};

getBestMovies();
