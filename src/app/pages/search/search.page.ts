import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { SearchService } from '../../services/search/search';
import { MovieService } from '../../services/search/movie';
import { MediaApiService } from '../../services/search/media';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SearchPage implements OnInit {
  filmes: any[] = [];

  constructor(
    private movieService: MovieService,
    private mediaApi: MediaApiService,
    private searchService: SearchService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarTudo();
  }

  // 🔎 Pesquisa filmes/séries/animes
  pesquisar(event: any): void {
    const valor = event.target.value?.trim();

    // Se apagar pesquisa, volta conteúdo inicial
    if (!valor) {
      this.carregarTudo();
      return;
    }

    this.searchService.pesquisarMulti(valor).subscribe({
      next: (res: any) => {
        this.filmes = res.results.filter((item: any) => {
          const possuiTitulo = item.title || item.name;
          const possuiPoster = item.poster_path;
          const tipoValido = item.media_type !== 'person';

          return possuiTitulo && possuiPoster && tipoValido;
        });
      },

      error: (erro) => {
        console.error('Erro na pesquisa TMDB:', erro);
      },
    });
  }

  // 🎬 Carrega conteúdo inicial
  carregarTudo(): void {
    forkJoin({
      filmes: this.mediaApi.getFilmes(),
      series: this.mediaApi.getSeries(),
      animes: this.mediaApi.getAnimes(),
    }).subscribe({
      next: (res: any) => {
        this.filmes = [
          ...res.filmes.results.map((f: any) => ({
            ...f,
            title: f.title,
            media_type: 'movie',
          })),

          ...res.series.results.map((s: any) => ({
            ...s,
            title: s.name,
            media_type: 'tv',
          })),

          ...res.animes.results.map((a: any) => ({
            ...a,
            title: a.name,
            media_type: 'anime',
          })),
        ].filter((item: any) => item.poster_path);
      },

      error: (erro) => {
        console.error('Erro ao carregar mídias:', erro);
      },
    });
  }

  voltar(): void {
    this.location.back();
  }

  estaAssistido(filme: any): boolean {
    return this.movieService.estaAssistido(filme);
  }

  abrirDetalhes(filme: any): void {
    this.router.navigate(['/movie-details'], {
      state: { filme },
    });
  }
}
