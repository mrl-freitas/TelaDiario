import { Injectable } from '@angular/core';

export interface Movie {
  id?: number;
  title?: string;
  original_title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private favoritos = new Set<string>();
  private assistidos = new Set<string>();

  // ⭐ Favoritos //

  alternarFavorito(filme: Movie): boolean {
    const id = this.obterIdFilme(filme);

    if (this.favoritos.has(id)) {
      this.favoritos.delete(id);
      return false;
    }

    this.favoritos.add(id);
    return true;
  }

  estaFavorito(filme: Movie): boolean {
    return this.favoritos.has(this.obterIdFilme(filme));
  }

  // ✔️ Assistidos //

  alternarAssistido(filme: Movie): boolean {
    const id = this.obterIdFilme(filme);

    if (this.assistidos.has(id)) {
      this.assistidos.delete(id);
      return false;
    }

    this.assistidos.add(id);
    return true;
  }

  estaAssistido(filme: Movie): boolean {
    return this.assistidos.has(this.obterIdFilme(filme));
  }

  //  🆔 UTILITÁRIO //

  private obterIdFilme(filme: Movie): string {
    return String(filme?.id ?? filme?.title ?? filme?.original_title ?? '');
  }
}
