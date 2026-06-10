import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { Folder } from '../../models/folder/folder.model';
import { WatchedMoviesService } from '../../services/watched-movies/watched-movies';
import { FolderService } from '../../services/folder/folder';
import { FolderMediaService } from '../../services/folder-media/folder-media';
import { MediaApiService } from 'src/app/services/home/media';

type Pasta = Folder;

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MovieDetailsPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  private watchedService = inject(WatchedMoviesService);
  private folderService = inject(FolderService);
  private folderMediaService = inject(FolderMediaService);
  private mediaApi = inject(MediaApiService);

  private destroy$ = new Subject<void>();

  // =========================
  // STATE
  // =========================
  filme: any = null;
  filmeId: number | null = null;

  pastas: Pasta[] = [];
  favoritesFolderId: string | null = null;

  isFavorite = false;

  sinopseExpandida = false;
  seletorPastasAberto = false;
  buscaPasta = '';
  pastaSelecionada = '';

  // =========================
  // INIT
  // =========================
  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.init());
  }

  ngOnInit(): void {
    this.init();
    this.loadFolders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // INIT FILME
  // =========================
  init(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const tipo = history.state?.tipo || 'movie';

    if (!id) return;

    this.filmeId = Number(id);
    this.loadMovie(this.filmeId, tipo);
  }

  loadMovie(id: number, tipo: string): void {
    this.mediaApi
      .getDetalhes(id, tipo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.filme = {
            ...data,
            title: data.title || data.name,
          };

          this.syncFavoriteState();
        },
      });
  }

  // =========================
  // PASTAS
  // =========================
  loadFolders(): void {
    this.folderService.listarPastas().subscribe({
      next: (data) => {
        this.pastas = data ?? [];

        const fav = this.pastas.find((p) => p.nome === 'favorites');
        this.favoritesFolderId = fav?.id ?? null;

        this.syncFavoriteState();
      },
    });
  }

  // =========================
  // ❤️ FAVORITO (CORE FIX)
  // =========================
  async syncFavoriteState(): Promise<void> {
    if (!this.filme?.id || !this.favoritesFolderId) return;

    this.isFavorite = await this.folderMediaService.mediaExiste(
      this.favoritesFolderId,
      this.filme.id,
    );
  }

  async toggleFavorite(): Promise<void> {
    if (!this.filme) return;

    // UI otimista (instantâneo)
    this.isFavorite = !this.isFavorite;

    try {
      // garante pasta existe
      if (!this.favoritesFolderId) {
        const fav = this.pastas.find((p) => p.nome === 'favorites');
        this.favoritesFolderId = fav?.id ?? null;
      }

      if (!this.favoritesFolderId) return;

      await this.folderMediaService.toggleMedia(
        this.favoritesFolderId,
        this.filme,
      );

      await this.syncFavoriteState();
    } catch (e) {
      // rollback seguro
      this.isFavorite = !this.isFavorite;
      console.error(e);
    }
  }

  // =========================
  // PASTAS (MODAL)
  // =========================
  abrirSeletorPastas(): void {
    this.seletorPastasAberto = true;
  }

  fecharSeletorPastas(): void {
    this.seletorPastasAberto = false;
    this.buscaPasta = '';
  }

  async selecionarPasta(nome: string): Promise<void> {
    const pasta = this.pastas.find((p) => p.nome === nome);
    if (!pasta || !this.filme) return;

    this.pastaSelecionada = nome;

    await this.folderMediaService.toggleMedia(pasta.id, this.filme);

    this.fecharSeletorPastas();
  }

  async criarPasta(): Promise<void> {
    const nome = this.buscaPasta.trim().toLowerCase();
    if (!nome) return;

    const exists = this.pastas.some((p) => p.nome.toLowerCase() === nome);
    if (exists) return;

    await this.folderService.criarPasta(nome);

    this.buscaPasta = '';
    this.loadFolders();
  }

  atualizarBuscaPasta(e: Event): void {
    this.buscaPasta = (e.target as HTMLInputElement).value;
  }

  get pastasFiltradas(): Pasta[] {
    const q = this.buscaPasta.trim().toLowerCase();
    if (!q) return this.pastas;

    return this.pastas.filter((p) => p.nome.toLowerCase().includes(q));
  }

  // =========================
  // ASSISTIDO
  // =========================
  get isAssistido(): boolean {
    const id = this.filme?.id || this.filmeId;
    return id ? this.watchedService.isWatched(id) : false;
  }

  async toggleAssistido(): Promise<void> {
    if (!this.filme) return;
    await this.watchedService.toggle(this.filme);
  }

  // =========================
  // SINOPSE
  // =========================
  sinopseExpandidaToggle(): void {
    this.sinopseExpandida = !this.sinopseExpandida;
  }

  get sinopse(): string {
    return this.filme?.overview || 'Sinopse indisponível.';
  }

  get sinopseExibida(): string {
    if (this.sinopseExpandida) return this.sinopse;

    return this.sinopse.length > 180
      ? this.sinopse.slice(0, 180) + '...'
      : this.sinopse;
  }

  // =========================
  // NAV
  // =========================
  voltar(): void {
    this.location.back();
  }

  // =========================
  // IMAGE
  // =========================
  get imagemBanner(): string {
    const c = this.filme?.backdrop_path || this.filme?.poster_path;

    return c
      ? `https://image.tmdb.org/t/p/w780${c}`
      : 'assets/banners/Duna.webp';
  }
}
