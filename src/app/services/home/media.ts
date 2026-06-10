import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}
