import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

interface Filme {
  titulo: string;
  imagem: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  constructor() {}

  // Banner ------------------------------------------------------------------------- //
  currentSlide = 0;
  totalSlides = 3;
  slideInterval: any;

  ngOnInit() {
    this.startAutoPlay();
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

  // LISTAS DE MÍDIA (Modifique os títulos e caminhos das fotos como quiser) -------- //

  // Lista 1: Filmes
  filmes = signal<Filme[]>([
    { titulo: 'Duna', imagem: 'assets/filmes/duna.webp' },
    { titulo: 'F1: O filme', imagem: 'assets/filmes/f1.webp' },
    { titulo: 'Avatar: Fogo e Cinzas', imagem: 'assets/filmes/avatar.webp' },
  ]);

  // Lista 2: Séries
  series = signal<Filme[]>([
    {
      titulo: 'O Cavaleiro dos Sete Reinos',
      imagem: 'assets/series/cavaleiro.webp',
    },
    { titulo: 'Ginny e Georgia', imagem: 'assets/series/ginny.webp' },
    { titulo: 'Reacher', imagem: 'assets/series/reacher.webp' },
  ]);

  // Lista 3: Documentários
  animes = signal<Filme[]>([
    { titulo: 'Jujutsu Kaisen', imagem: 'assets/animes/jujutsu.webp' },
    {
      titulo: 'Demon Slayer: Kimetsu no Yaiba',
      imagem: 'assets/animes/demon.webp',
    },
    {
      titulo: 'Frieren e a Jornada para o Além',
      imagem: 'assets/animes/frieren.webp',
    },
  ]);

  // LOGICA DO CARROSSEL POR ARRASTO ------------------------------------------------ //
  private isDragging = false;
  private startX = 0;
  private scrollLeftStart = 0;
  private currentContainer: HTMLDivElement | null = null;

  startDragging(e: MouseEvent | TouchEvent, container: HTMLDivElement) {
    this.isDragging = true;
    this.currentContainer = container;
    container.classList.add('active');

    const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    this.startX = pageX - container.offsetLeft;
    this.scrollLeftStart = container.scrollLeft;
  }

  onDragging(e: MouseEvent | TouchEvent) {
    if (!this.isDragging || !this.currentContainer) return;

    e.preventDefault();

    const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    const x = pageX - this.currentContainer.offsetLeft;

    const walk = (x - this.startX) * 2; // Multiplique por mais se quiser o arrasto mais rápido
    this.currentContainer.scrollLeft = this.scrollLeftStart - walk;
  }

  stopDragging() {
    if (this.currentContainer) {
      this.currentContainer.classList.remove('active');
    }
    this.isDragging = false;
    this.currentContainer = null;
  }
}
