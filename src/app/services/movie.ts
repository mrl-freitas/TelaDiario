import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private http = inject(HttpClient);

  private apiKey = 'f44d4f34d6194f5ac0aae7bce063c307';

  private baseUrl = 'https://api.themoviedb.org/3';

  termoBusca = '';

  filmes: any[] = [];

  private filmesParaAssistir = new Set<string>();

  searchMovies(query: string) {
    const termo = encodeURIComponent(query.trim());

    return this.http.get(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${termo}&language=pt-BR`
    );

  }

  alternarParaAssistir(filme: any) {
    const idFilme = this.obterIdFilme(filme);

    if (this.filmesParaAssistir.has(idFilme)) {
      this.filmesParaAssistir.delete(idFilme);
      return false;
    }

    this.filmesParaAssistir.add(idFilme);
    return true;
  }

  estaMarcadoParaAssistir(filme: any) {
    return this.filmesParaAssistir.has(this.obterIdFilme(filme));
  }

  private obterIdFilme(filme: any) {
    return String(filme?.id || filme?.title || filme?.original_title || '');
  }

}
