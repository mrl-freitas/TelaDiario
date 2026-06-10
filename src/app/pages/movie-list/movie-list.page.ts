import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MovieGenres } from '../../services/movie-genres/movie-genres';
import { SeriesGenres } from '../../services/series-genres/series-genres';
import { AnimesGenres } from '../../services/animes-genres/animes-genres';
import { WatchedMoviesService } from '../../services/watched-movies/watched-movies';

type MediaType = 'movie' | 'tv' | 'anime';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class MovieListPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Injetando o serviço de assistidos (que usa Signals)
  private watchedService = inject(WatchedMoviesService);

  items: any[] = [];

  // Criamos um Signal computado que transforma a lista do serviço em um Set para performance
  watchedIds = computed(
    () => new Set(this.watchedService.watched().map((m) => Number(m['id']))),
  );

  private type!: MediaType;
  private genreId!: number;

  constructor(
    private movieService: MovieGenres,
    private seriesService: SeriesGenres,
    private animesService: AnimesGenres,
  ) {}

  ngOnInit(): void {
    this.readParams();
    this.loadData();
  }

  // Agora basta chamar o método do serviço diretamente
  isWatched(id: number): boolean {
    return this.watchedIds().has(Number(id));
  }

  private readParams(): void {
    const typeParam = this.route.snapshot.paramMap.get('type');
    const genreParam = this.route.snapshot.paramMap.get('genreId');

    this.type = (typeParam as MediaType) || 'movie';
    this.genreId = Number(genreParam);
  }

  private loadData(): void {
    const requestMap: Record<MediaType, any> = {
      movie: this.movieService.getByGenre(this.genreId),
      tv: this.seriesService.getByGenre(this.genreId),
      anime: this.animesService.getByGenre(this.genreId),
    };

    requestMap[this.type]?.subscribe({
      next: (res: any) => {
        this.items = res?.results ?? [];
      },
    });
  }

  voltar(): void {
    const routeMap: Record<MediaType, string> = {
      movie: '/movie-genres',
      tv: '/series-genres',
      anime: '/anime-genres',
    };
    this.router.navigate([routeMap[this.type]]);
  }

  abrirDetalhes(item: any): void {
    this.router.navigate(['/movie-details'], {
      state: { filme: item },
    });
  }
}
