import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import MoviesRepository, { type Movie } from "../repositories/movies.repository";
import MovieFound from "../components/movie-found";
import { iterateFromIndex } from "../utils/functions";
import { TOTAL_MOVIES_PER_PAGE } from "../utils/envs";
import Head from "../components/head";

export default function RandomMovie() {
    const [error, setError] = useState<string | null>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [movies, setMovies] = useState<Movie[] | null>(null);
    const [foundMoreThanOne, setFoundMoreThanOne] = useState<boolean>(false);
    const [totalMoviesFound, setTotalMoviesFound] = useState<number | null>(null);
    const [paginationMovies, setPaginationMovies] = useState<Movie[]>();
    const [pageCount, setPageCount] = useState(0);
    const [pageOffset, setPageOffset] = useState(0);
    const [bookTitleSearched, setMovieTitleSearched] = useState("");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const recommendRandomMovie = useCallback(async () => {
        setError("");
        const randomBook = new MoviesRepository().getRandom();

        setMovie({
            ...randomBook,
        });
        setPageCount(0);
    }, []);

    const searchMovieByTitle = useCallback(async (title: string | null) => {
        if (title) {
            const searchMovieTitle = new MoviesRepository().searchAllMoviesSimilarTitle(title);
            const randomBook = new MoviesRepository().getRandom();

            if (!searchMovieTitle.length) {
                setMovieTitleSearched(title);
                setError(`Nothing Found for Search: ${title}... Recommending random movie`);
                setTotalMoviesFound(null);
                setMovies(null);
                setPageCount(0);
                setFoundMoreThanOne(false);

                setMovie({
                    ...randomBook,
                });
            }

            if (searchMovieTitle.length > 1) {
                setError("");
                setFoundMoreThanOne(true);
                setTotalMoviesFound(searchMovieTitle.length);
                setMovies(searchMovieTitle);
                setPageCount(Math.ceil((movies?.length as number) / TOTAL_MOVIES_PER_PAGE));
            } else if (searchMovieTitle.length === 1) {
                setError("");
                setMovies(null);
                setFoundMoreThanOne(false);
                setPageCount(0);
                setMovie({
                    ...searchMovieTitle[0],
                });
            }
        }
    }, []);

    useEffect(() => {
        if (queryParams.get("search")) {
            const search = queryParams.get("search");
            searchMovieByTitle(search);
        } else {
            recommendRandomMovie();
        }
    }, [queryParams.get("search")]);

    useEffect(() => {
        if (movies?.length) {
            setPaginationMovies(iterateFromIndex(movies, 0));
            setPageCount(Math.ceil(movies?.length / TOTAL_MOVIES_PER_PAGE));
            setPageOffset(0);
        }
    }, [movies]);

    useEffect(() => {
        if (movie) {
            setMovies(null);
            setFoundMoreThanOne(false);
            setPageCount(0);
            setTotalMoviesFound(0);
        }
    }, [movie]);

    const handlePageChange = (event: any) => {
        setPaginationMovies(iterateFromIndex(movies!, event.selected));
        setPageCount(Math.ceil((movies?.length as number) / TOTAL_MOVIES_PER_PAGE));
        setPageOffset(event.selected);
    };

    return (
        <>
            <Head title="movies.alexgalhardo.com" description="The best movies recomendation." />
            <Navbar />
            <div className="container" style={{ marginTop: "100px" }}>
                <div className="row mt-5">
                    {/* {error && <ErrorAlertMessage message={error} />} */}

                    {error && (
                        <p className="fs-3 mb-5 alert alert-light d-flex justify-content-between">
                            <span>
                                Not Found: <strong className="text-danger">{bookTitleSearched}</strong>{" "}
                            </span>
                            <span className="text-info">Recommending Random Movie...</span>
                        </p>
                    )}

                    {totalMoviesFound !== 0 ? (
                        <p className="fs-3 mb-5 alert alert-light d-flex justify-content-between">
                            <span>
                                Searching: <strong className="text-success">{queryParams.get("search")}</strong>
                            </span>
                            <span>
                                Found:{" "}
                                <strong className="text-danger">
                                    {" "}
                                    {totalMoviesFound} {totalMoviesFound! > 1 ? "Books" : "Movie"}
                                </strong>
                            </span>
                        </p>
                    ) : null}

                    {totalMoviesFound && totalMoviesFound > TOTAL_MOVIES_PER_PAGE ? (
                        <ReactPaginate
                            previousLabel="Previous"
                            nextLabel="Next"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            pageCount={pageCount}
                            pageRangeDisplayed={TOTAL_MOVIES_PER_PAGE}
                            onPageChange={handlePageChange}
                            containerClassName="pagination"
                            activeClassName="active"
                            className="pagination justify-content-center mb-5"
                            forcePage={pageOffset}
                        />
                    ) : null}

                    {!foundMoreThanOne ? (
                        <MovieFound movie={movie} buttonRecommend={true} recommendRandomMovie={recommendRandomMovie} />
                    ) : null}

                    {foundMoreThanOne &&
                        movies &&
                        totalMoviesFound &&
                        paginationMovies?.map((movie: Movie) => <MovieFound movie={movie} />)}

                    {totalMoviesFound && totalMoviesFound > TOTAL_MOVIES_PER_PAGE ? (
                        <ReactPaginate
                            previousLabel="Previous"
                            nextLabel="Next"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            pageCount={pageCount}
                            pageRangeDisplayed={TOTAL_MOVIES_PER_PAGE}
                            onPageChange={handlePageChange}
                            containerClassName="pagination"
                            activeClassName="active"
                            className="pagination justify-content-center mb-5"
                            forcePage={pageOffset}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
}
