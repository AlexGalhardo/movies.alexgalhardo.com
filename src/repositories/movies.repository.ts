import * as stringSimilarity from "string-similarity";

import moviesRepository from "./jsons/best-movies-info.json";

export interface Genre {
	id: number;
	name: string;
	slug?: string;
}

export interface Movie {
	id: number;
	imdb_id: string | null;
	original_title: string;
	title: string;
	slug: string;
	vote_average: number;
	release_date: string;
	runtime: number;
	overview: string;
	popularity: number;
	poster: string;
	genres: Genre[];
}

export interface MoviesRepositoryPort {
	getRandom(): Movie;
	getById(id: number): Movie;
	getByTitleSlug(slug: string): Movie;
	searchAllMoviesSimilarTitle(bookTitle: string): Movie[];
	getByGenre(genre: string): Movie[];
}

export default class MoviesRepository implements MoviesRepositoryPort {
	constructor(private movies: Movie[] = moviesRepository) { }

	public getById(id: number): Movie {
		return this.movies.filter((movie: Movie) => movie.id === id)[0];
	}

	public getRandom(): Movie {
		return this.movies[Math.floor(Math.random() * this.movies.length)];
	}

	public getByTitleSlug(slug: string): Movie {
		return this.movies.filter((movie: Movie) => movie.slug.toLowerCase().includes(slug.toLowerCase()))[0];
	}

	public searchAllMoviesSimilarTitle(title: string): Movie[] {
		const moviesFound = this.movies.filter((movie: Movie) =>
			movie.title.toLowerCase().includes(title.toLowerCase()),
		);

		const matches = stringSimilarity.findBestMatch(
			title,
			this.movies.map((movie) => movie.title),
		);

		matches.ratings.forEach((similarity) => {
			if (similarity.rating >= 0.5) {
				if (!moviesFound.some((book) => book.title.toLowerCase() === similarity.target.toLowerCase())) {
					moviesFound.push(this.movies.filter((movie) => movie.title === similarity.target)[0]);
				}
			}
		});

		return moviesFound;
	}

	public getByGenre(genre: string): Movie[] {
		return this.movies.filter((movie: Movie) => movie.genres.some((item: Genre) => item.slug === genre));
	}
}
