import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useNavigate, useParams } from "react-router-dom";
import MoviesRepository, { type Movie } from "../repositories/movies.repository";
import Head from "../components/head";
import MovieFound from "../components/movie-found";

export default function MoviePage() {
    const { title } = useParams();
    const pageDescription = `See information about ${title}`;
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>();
    const searchMovieByTitle = useCallback(async (bookTitleSlug: string) => {
        const movieFound = new MoviesRepository().getByTitleSlug(bookTitleSlug);
        if (!movieFound) {
            setMovie(null);
            navigate("/");
        }

        setMovie(movieFound);
    }, []);

    useEffect(() => {
        if (title) {
            searchMovieByTitle(title);
        } else {
            navigate("/");
        }
    }, [title]);

    return (
        <>
            <Head title={movie?.title} description={pageDescription} />
            <Navbar />
            <div className="container" style={{ marginTop: "100px" }}>
                <div className="row mt-5">
                    <MovieFound movie={movie} />
                </div>
            </div>
        </>
    );
}
