import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FolderMediaService } from '../../services/folder-media/folder-media';

@Component({
  selector: 'app-folder-details',
  templateUrl: './folder-details.page.html',
  styleUrls: ['./folder-details.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterLink],
})
export class FolderDetailsPage implements OnInit {
  // =========================
  // INJEÇÕES
  // =========================
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private folderMediaService = inject(FolderMediaService);

  // =========================
  // STATE
  // =========================
  folderId = '';
  filmes: any[] = [];

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) return;

      this.folderId = id;
      this.carregarMidias();
    });
  }

  // =========================
  // LOAD DATA
  // =========================
  private carregarMidias(): void {
    this.folderMediaService.listarMidias(this.folderId).subscribe({
      next: (midias: any[]) => {
        this.filmes = (midias ?? []).map((item) => ({
          // 🔥 garante consistência de ID
          id: item.mediaId || item.id,

          titulo: item.titulo,
          imagem: item.imagem,

          // 🔥 evita undefined que quebra o detalhe
          media_type: item.media_type ?? 'movie',
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar mídias da pasta:', err);
      },
    });
  }

  // =========================
  // NAVIGATION
  // =========================
  abrirDetalhes(item: any) {
    this.router.navigate(['/movie-details', item.id], {
      state: { tipo: item.media_type, titulo: item.titulo },
    });
  }

  // =========================
  // BACK BUTTON
  // =========================
  voltar(): void {
    this.location.back();
  }

  // =========================
  // IMAGE FALLBACK
  // =========================
  getImagem(item: any): string {
    return item?.imagem
      ? `https://image.tmdb.org/t/p/w342${item.imagem}`
      : 'assets/banners/Duna.webp';
  }
}
