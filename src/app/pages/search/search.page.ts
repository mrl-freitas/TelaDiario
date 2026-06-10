import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { SearchService } from '../../services/search/search';
import { MediaApiService } from '../../services/search/media';
import { WatchedMoviesService } from '../../services/watched-movies/watched-movies';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SearchPage implements OnInit {
  filmes: any[] = [];

  // Injeção do serviço que usa Signals
  private watchedService = inject(WatchedMoviesService);
  private location = inject(Location);
  private router = inject(Router);

  // Signal computado para verificar se está assistido
  // Transforma a lista do serviço em um Set para acesso rápido
  watchedIds = computed(
    () => new Set(this.watchedService.watched().map((m) => Number(m['id']))),
  );

  constructor(
    private mediaApi: MediaApiService,
    private searchService: SearchService,
  ) {}

  ngOnInit(): void {
    // Não precisamos mais de carregarAssistidos() aqui,
    // pois o serviço já é reativo através do Signal.
    this.carregarTudo();
  }

  // Verifica o estado assistido através do Signal computado
  isWatched(id: number): boolean {
    return this.watchedIds().has(Number(id));
  }

  // 🔎 Pesquisa filmes/séries/animes
  pesquisar(event: any): void {
    const valor = event.target.value?.trim();

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
      error: (erro: any) => {
        console.error('Erro na pesquisa TMDB:', erro);
      },
    });
  }

  // 🎬 Conteúdo inicial
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
      error: (erro: any) => {
        console.error('Erro ao carregar mídias:', erro);
      },
    });
  }

  voltar(): void {
    this.location.back();
  }

  abrirDetalhes(item: any): void {
    this.router.navigate(['/movie-details'], {
      state: { filme: item },
    });
  }
}
