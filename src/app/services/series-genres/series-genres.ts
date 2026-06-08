import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SeriesGenres {
  private http = inject(HttpClient);

  private apiKey = 'eb281e49ab0aa5a08da566da79621708';

  getTvGenres() {
    return this.http.get(
      `https://api.themoviedb.org/3/genre/tv/list?language=pt-BR&api_key=${this.apiKey}`,
    );
  }

  getByGenre(genreId: number) {
    return this.http.get(
      `https://api.themoviedb.org/3/discover/tv?language=pt-BR&api_key=${this.apiKey}&with_genres=${genreId}`,
    );
  }
}
