import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieGenres {
  private http = inject(HttpClient);

  private apiKey = 'eb281e49ab0aa5a08da566da79621708';

  // Lista de gêneros
  getMovieGenres() {
    return this.http.get(
      `https://api.themoviedb.org/3/genre/movie/list?language=pt-BR&api_key=${this.apiKey}`,
    );
  }

  // 🔥 ISSO QUE ESTAVA FALTANDO
  getByGenre(genreId: number) {
    return this.http.get(
      `https://api.themoviedb.org/3/discover/movie?language=pt-BR&api_key=${this.apiKey}&with_genres=${genreId}`,
    );
  }
}
