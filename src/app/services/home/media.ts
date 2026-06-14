import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MediaType } from 'src/app/models/home/media-item';

interface TmdbListResponse {
  page: number;
  results: TmdbMovieResult[];
  total_pages: number;
  total_results: number;
}

interface TmdbMovieResult {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaApiService {
  private http = inject(HttpClient);

  private apiKey = 'eb281e49ab0aa5a08da566da79621708';
  private baseUrl = 'https://api.themoviedb.org/3';

  getFilmes() {
    return this.http.get<any>(`${this.baseUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR',
      },
    });
  }

  getRandomMovie(): Observable<MediaType> {
    return this.http
      .get<TmdbListResponse>(`${this.baseUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          language: 'pt-BR',
          sort_by: 'popularity.desc',
          include_adult: false,
          page: 1,
        },
      })
      .pipe(
        switchMap((firstPage) => {
          const maxTmdbPage = 500;
          const totalPages = Math.max(
            1,
            Math.min(firstPage.total_pages || 1, maxTmdbPage),
          );
          const randomPage = this.randomBetween(1, totalPages);

          return this.http.get<TmdbListResponse>(
            `${this.baseUrl}/discover/movie`,
            {
              params: {
                api_key: this.apiKey,
                language: 'pt-BR',
                sort_by: 'popularity.desc',
                include_adult: false,
                page: randomPage,
              },
            },
          );
        }),
        map((res) => {
          const movies = res.results.filter((movie) => !!movie.poster_path);

          if (!movies.length) {
            throw new Error('Nenhum filme encontrado para sorteio.');
          }

          return this.mapMovieToMedia(
            movies[this.randomBetween(0, movies.length - 1)],
          );
        }),
      );
  }

  getSeries() {
    return this.http.get<any>(`${this.baseUrl}/tv/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR',
      },
    });
  }

  getAnimes() {
    return this.http.get<any>(`${this.baseUrl}/discover/tv`, {
      params: {
        api_key: this.apiKey,
        with_genres: 16,
        with_origin_country: 'JP',
        language: 'pt-BR',
      },
    });
  }

  getDetalhes(id: number, tipo: string) {
    const endpoint = tipo === 'anime' ? 'tv' : tipo;

    return this.http.get<any>(`${this.baseUrl}/${endpoint}/${id}`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR',
      },
    });
  }

  private mapMovieToMedia(movie: TmdbMovieResult): MediaType {
    return {
      ...movie,
      id: movie.id,
      titulo: movie.title || movie.name || 'Filme sem titulo',
      imagem: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'assets/banners/Duna.webp',
      media_type: 'movie',
    };
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
