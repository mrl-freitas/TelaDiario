import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  private apiKey = 'eb281e49ab0aa5a08da566da79621708';
  private baseUrl = 'https://api.themoviedb.org/3';

  pesquisarMulti(query: string) {
    return this.http.get<any>(
      `${this.baseUrl}/search/multi?api_key=${this.apiKey}&language=pt-BR&query=${query}`,
    );
  }
}
