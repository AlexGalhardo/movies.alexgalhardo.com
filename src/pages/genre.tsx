import Navbar from "../components/navbar";
import Head from "../components/head";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MoviesRepository, { type Movie } from "../repositories/movies.repository";
import MovieFound from "../components/movie-found";
import allGenres from "../repositories/jsons/all-genres.json";
import ReactPaginate from "react-paginate";
import { TOTAL_MOVIES_PER_PAGE } from "../utils/envs";
import { paginateIterateFromIndex } from "../utils/paginate-iterate-from-index";
import ProgressBar from "../components/progress-bar";

export default function GenrePage() {
    const { genre } = useParams();
    const genreName = allGenres.filter((item) => item.slug === genre)[0].name;
    const pageTitle = `${genreName} Movies`;
    const pageDescription = `See movies genre ${genre}`;
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Movie[] | null>(null);
    const [totalMoviesFound, setTotalMoviesFound] = useState<number | null>(null);
    const [paginationMovies, setPaginationMovies] = useState<Movie[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [pageOffset, setPageOffset] = useState(0);

    const searchGenreMovies = useCallback(async (genreName: string) => {
        const moviesFound = new MoviesRepository().getByGenre(genreName);
        if (!moviesFound.length) navigate("/");
        setTotalMoviesFound(moviesFound.length);
        setMovies(moviesFound);
    }, []);

    useEffect(() => {
        if (genre) {
            searchGenreMovies(genre);
        } else {
            navigate("/");
        }
    }, [genre]);

    useEffect(() => {
        if (movies?.length) {
            setPaginationMovies(paginateIterateFromIndex(movies, 0));
            setPageCount(Math.ceil(movies.length / TOTAL_MOVIES_PER_PAGE));
            setPageOffset(0);
        }
    }, [movies]);

    const handlePageChange = (event: any) => {
        setPaginationMovies(paginateIterateFromIndex(movies!, event.selected));
        setPageCount(Math.ceil((movies?.length as number) / TOTAL_MOVIES_PER_PAGE));
        setPageOffset(event.selected);
    };

    return (
        <>
            <Head title={pageTitle} description={pageDescription} />
            <ProgressBar />
            <Navbar />
            <div className="container col-lg-8 text-wrap" style={{ marginTop: "100px" }}>
                <div className="row mt-5">
                    {totalMoviesFound && (
                        <p className="fs-3 mb-5 alert alert-light d-flex justify-content-between">
                            <span>
                                Genre: <strong className="text-success">{genreName}</strong>{" "}
                            </span>
                            <span>
                                Found:{" "}
                                <strong className="text-danger">
                                    {totalMoviesFound} {totalMoviesFound > 1 ? "Movies" : "Movie"}
                                </strong>
                            </span>
                        </p>
                    )}

                    {totalMoviesFound && totalMoviesFound > TOTAL_MOVIES_PER_PAGE && (
                        <div style={{ overflowX: "hidden" }}>
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
                        </div>
                    )}

                    {paginationMovies?.map((movie) => <MovieFound key={movie.id} movie={movie} />)}

                    {totalMoviesFound && totalMoviesFound > TOTAL_MOVIES_PER_PAGE && (
                        <div style={{ overflowX: "hidden" }}>
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
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
