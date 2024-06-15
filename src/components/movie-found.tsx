import slugify from "slugify";
import type { Movie } from "../repositories/movies.repository";
import { formatDate } from "../utils/date";

export default function MovieFound({
    movie,
    buttonRecommend,
    recommendRandomMovie,
}: {
    movie: Movie | null | undefined;
    buttonRecommend?: boolean;
    recommendRandomMovie?: any;
}) {
    return (
        <>
            <div className="col-lg-4 text-center">
                <img
                    id="game_image"
                    src={movie?.poster}
                    className="shadow mx-auto d-block w-100 image-fluid mb-3"
                    alt="game_image"
                />
                {buttonRecommend && (
                    <button
                        className="button mt-3 w-100 btn mb-5 btn-success fw-bold fs-5"
                        onClick={recommendRandomMovie}
                    >
                        <i className="bi bi-play-fill"></i>Random Movie
                    </button>
                )}
            </div>

            <div className="col-lg-8">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <h2>
                            <span className="fw-bold">{movie?.title} </span>
                        </h2>

                        <p className="fs-2 fw-bold text-warning text-decoration-none">
                            ⭐ <span id="movie_tmdb_rating">{movie?.vote_average.toFixed(1)}</span>
                        </p>
                    </div>

                    <p>{movie?.overview}</p>

                    <ul>
                        <li>
                            <span className="fw-bold">Release Date: </span> {formatDate(movie?.release_date as string)}
                        </li>
                        <li>
                            <span className="fw-bold">Genres:</span>
                            <ul>
                                {movie?.genres.map((genre) => (
                                    <li key={genre.id}>
                                        <a
                                            className="text-decoration-none"
                                            href={`/genre/${slugify(genre.name, { lower: true, strict: true })}`}
                                        >
                                            {genre.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <span className="mt-5" />
        </>
    );
}
