import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { WatchedMoviesService } from '../../services/watched-movies/watched-movies';
import { MediaApiService } from 'src/app/services/home/media';
import { MediaType } from 'src/app/models/home/media-item';
import { ShakeDetectorService } from 'src/app/services/shake/shake-detector';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonSpinner, CommonModule, FormsModule],
})
export class HomePage implements OnInit, OnDestroy {
  // =========================
  // INJEÇÕES
  // =========================
  private mediaApi = inject(MediaApiService);
  private watchedService = inject(WatchedMoviesService);
  private shakeDetector = inject(ShakeDetectorService);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);

  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  private shakeSubscription?: Subscription;
  private discoverSubscription?: Subscription;

  // =========================
  // LISTAS
  // =========================
  filmes = signal<MediaType[]>([]);
  series = signal<MediaType[]>([]);
  animes = signal<MediaType[]>([]);
  randomMovie = signal<MediaType | null>(null);
  isDiscovering = signal(false);

  // =========================
  // BANNER
  // =========================
  currentSlide = 0;
  totalSlides = 3;
  slideInterval?: any;

  // =========================
  // DRAG
  // =========================
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private scrollLeftStart = 0;
  private container: HTMLDivElement | null = null;
  private horizontal = false;

  // =========================
  // INIT
  // =========================
  ngOnInit() {
    this.startAutoPlay();

    this.carregarFilmes();
    this.carregarSeries();
    this.carregarAnimes();
    this.startShakeToDiscover();
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
    this.shakeSubscription?.unsubscribe();
    this.discoverSubscription?.unsubscribe();
    void this.shakeDetector.stop();
  }

  // =========================
  // WATCHED (FONTE ÚNICA)
  // =========================
  isWatched(id: number): boolean {
    return this.watchedService.isWatched(id);
  }

  // =========================
  // BANNER
  // =========================
  startAutoPlay() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    }, 3000);
  }

  goToSlide(i: number) {
    this.currentSlide = i;
    clearInterval(this.slideInterval);
    this.startAutoPlay();
  }

  // =========================
  // API
  // =========================
  carregarFilmes() {
    this.mediaApi.getFilmes().subscribe((res) => {
      this.filmes.set(this.mapMedia(res.results, 'movie'));
    });
  }

  carregarSeries() {
    this.mediaApi.getSeries().subscribe((res) => {
      this.series.set(this.mapMedia(res.results, 'tv'));
    });
  }

  carregarAnimes() {
    this.mediaApi.getAnimes().subscribe((res) => {
      this.animes.set(this.mapMedia(res.results, 'anime'));
    });
  }

  private startShakeToDiscover(): void {
    this.shakeSubscription = this.shakeDetector.shake$.subscribe(() => {
      this.discoverRandomMovie();
    });

    void this.shakeDetector
      .start({
        threshold: 18,
        cooldownMs: 2000,
      })
      .catch((error) => this.handleShakeStartError(error));
  }

  private discoverRandomMovie(): void {
    if (this.isDiscovering()) {
      return;
    }

    this.isDiscovering.set(true);

    // Haptics pode nao estar disponivel no navegador; a falha nao deve interromper o sorteio.
    void Haptics.impact({ style: ImpactStyle.Medium }).catch((error) => {
      console.warn('Feedback haptico indisponivel:', error);
    });

    this.discoverSubscription = this.mediaApi
      .getRandomMovie()
      .pipe(finalize(() => this.isDiscovering.set(false)))
      .subscribe({
        next: (movie) => {
          this.randomMovie.set(movie);
        },
        error: (error: unknown) => {
          this.handleDiscoverError(error);
        },
      });
  }

  private handleShakeStartError(error: unknown): void {
    console.error('Erro ao iniciar sensor de movimento:', error);
  }

  private async handleDiscoverError(error: unknown): Promise<void> {
    console.error('Erro ao sortear filme:', error);

    const toast = await this.toastCtrl.create({
      message: 'Nao foi possivel sortear um filme agora. Tente novamente.',
      duration: 2500,
      color: 'danger',
    });

    await toast.present();
  }

  private mapMedia(list: any[], type: string): MediaType[] {
    return list.map((item) => ({
      ...item,
      id: item.id,
      titulo: item.title || item.name,
      imagem: `${this.imageBaseUrl}${item.poster_path}`,
      media_type: type,
    }));
  }

  // =========================
  // NAV
  // =========================
  abrirDetalhes(item: MediaType) {
    this.router.navigate(['/movie-details', item.id], {
      state: { tipo: item.media_type },
    });
  }

  // =========================
  // DRAG CAROUSEL
  // =========================
  startDragging(e: MouseEvent | TouchEvent, container: HTMLDivElement) {
    this.isDragging = true;
    this.container = container;
    this.horizontal = false;

    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    const y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

    this.startX = x;
    this.startY = y;
    this.scrollLeftStart = container.scrollLeft;
  }

  onDragging(e: MouseEvent | TouchEvent) {
    if (!this.isDragging || !this.container) return;

    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    const y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

    const dx = x - this.startX;
    const dy = Math.abs(y - this.startY);

    if (!this.horizontal) {
      if (dy > 10) {
        this.stopDragging();
        return;
      }
      this.horizontal = true;
    }

    e.preventDefault();
    this.container.scrollLeft = this.scrollLeftStart - dx;
  }

  stopDragging() {
    this.isDragging = false;
    this.container = null;
    this.horizontal = false;
  }
}
