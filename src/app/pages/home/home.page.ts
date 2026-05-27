import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { MediaType } from 'src/app/models/home/media-item';
import { MediaApiService } from 'src/app/services/home/media';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class HomePage implements OnInit, OnDestroy {
  private mediaApi = inject(MediaApiService);

  private router = inject(Router);

  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  // Banner ------------------------------------------------------------------------- //

  currentSlide = 0;

  totalSlides = 3;

  slideInterval: any;

  ngOnInit() {
    this.startAutoPlay();

    this.carregarFilmes();

    this.carregarSeries();

    this.carregarAnimes();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoPlay() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  goToSlide(index: number) {
    this.currentSlide = index;

    clearInterval(this.slideInterval);

    this.startAutoPlay();
  }

  // Banner ------------------------------------------------------------------------- //

  // LISTAS DE MÍDIA ---------------------------------------------------------------- //

  filmes = signal<MediaType[]>([]);

  series = signal<MediaType[]>([]);

  animes = signal<MediaType[]>([]);

  carregarFilmes() {
    this.mediaApi.getFilmes().subscribe({
      next: (response) => {
        const dados: MediaType[] = response.results.map((item: any) => ({
          ...item,

          id: item.id,

          titulo: item.title,

          imagem: `${this.imageBaseUrl}${item.poster_path}`,

          media_type: 'movie',
        }));

        this.filmes.set(dados);
      },
    });
  }

  carregarSeries() {
    this.mediaApi.getSeries().subscribe({
      next: (response) => {
        const dados: MediaType[] = response.results.map((item: any) => ({
          ...item,

          id: item.id,

          titulo: item.name,

          imagem: `${this.imageBaseUrl}${item.poster_path}`,

          media_type: 'tv',
        }));

        this.series.set(dados);
      },
    });
  }

  carregarAnimes() {
    this.mediaApi.getAnimes().subscribe({
      next: (response) => {
        const dados: MediaType[] = response.results.map((item: any) => ({
          ...item,

          id: item.id,

          titulo: item.name,

          imagem: `${this.imageBaseUrl}${item.poster_path}`,

          media_type: 'anime',
        }));

        this.animes.set(dados);
      },
    });
  }

  abrirDetalhes(filme: MediaType): void {
    this.router.navigate(['/movie-details'], {
      state: { filme },
    });
  }

  // LOGICA DO CARROSSEL POR ARRASTO ------------------------------------------------ //

  private isDragging = false;

  private startX = 0;

  private startY = 0;

  private scrollLeftStart = 0;

  private currentContainer: HTMLDivElement | null = null;

  private isHorizontalGesture = false;

  startDragging(e: MouseEvent | TouchEvent, container: HTMLDivElement) {
    this.isDragging = true;

    this.currentContainer = container;

    this.isHorizontalGesture = false;

    const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;

    const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

    this.startX = pageX - container.offsetLeft;

    this.startY = pageY;

    this.scrollLeftStart = container.scrollLeft;
  }

  onDragging(e: MouseEvent | TouchEvent) {
    if (!this.isDragging || !this.currentContainer) return;

    const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;

    const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;

    const deltaX = pageX - (this.startX + this.currentContainer.offsetLeft);

    const deltaY = Math.abs(pageY - this.startY);

    if (!this.isHorizontalGesture) {
      if (deltaY > 10) {
        this.stopDragging();

        return;
      }

      this.isHorizontalGesture = true;
    }

    e.preventDefault();

    this.currentContainer.scrollLeft = this.scrollLeftStart - deltaX * 2;
  }

  stopDragging() {
    this.isDragging = false;

    this.isHorizontalGesture = false;

    this.currentContainer = null;
  }
}
