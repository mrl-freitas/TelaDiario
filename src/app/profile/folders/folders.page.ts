import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { FolderService } from '../../services/folder/folder';
import { Folder } from '../../models/folder/folder.model';

@Component({
  selector: 'app-folder',
  templateUrl: './folders.page.html',
  styleUrls: ['./folders.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterLink],
})
export class FavoritesPage implements OnInit {
  private readonly folderService = inject(FolderService);

  // =========================
  // 📦 STATE
  // =========================
  folders: Folder[] = [];

  modalAberto = false;
  modalAcaoAberto = false;

  nomePasta = '';
  novoNome = '';

  pastaSelecionada: Folder | null = null;

  loading = false;

  // =========================
  // 🚀 INIT
  // =========================
  ngOnInit(): void {
    this.carregarPastas();
  }

  // =========================
  // 📁 LISTAR
  // =========================
  carregarPastas(): void {
    this.folderService.listarPastas().subscribe({
      next: (data) => {
        this.folders = data ?? [];
      },
      error: (err) => {
        console.error('Erro ao carregar pastas:', err);
        this.folders = [];
      },
    });
  }

  // =========================
  // ➕ CRIAR
  // =========================
  async criarPasta(): Promise<void> {
    const nome = this.nomePasta.trim();
    if (!nome) return;

    await this.executarComLoading(async () => {
      await this.folderService.criarPasta(nome);
      this.fecharModal();
    });
  }

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.nomePasta = '';
  }

  // =========================
  // ⚙️ AÇÕES
  // =========================
  abrirModalAcao(folder: Folder): void {
    this.pastaSelecionada = folder;
    this.novoNome = folder.nome;
    this.modalAcaoAberto = true;
  }

  fecharModalAcao(): void {
    this.modalAcaoAberto = false;
    this.pastaSelecionada = null;
    this.novoNome = '';
  }

  // =========================
  // ✏️ RENOMEAR
  // =========================
  async renomearPasta(): Promise<void> {
    if (!this.pastaSelecionada) return;

    const nome = this.novoNome.trim();
    if (!nome) return;

    const id = this.pastaSelecionada.id;
    if (!id) return;

    await this.executarComLoading(async () => {
      await this.folderService.renomearPasta(id, nome);
      this.fecharModalAcao();
    });
  }

  // =========================
  // 🗑️ APAGAR
  // =========================
  async apagarPasta(): Promise<void> {
    const id = this.pastaSelecionada?.id;
    if (!id) return;

    await this.executarComLoading(async () => {
      await this.folderService.apagarPasta(id);
      this.fecharModalAcao();
    });
  }

  // =========================
  // 🧠 HELPERS
  // =========================
  private async executarComLoading(fn: () => Promise<void>): Promise<void> {
    this.loading = true;

    try {
      await fn();
    } catch (err) {
      console.error('Erro na operação:', err);
    } finally {
      this.loading = false;
    }
  }
}
