import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folders.page.html',
  styleUrls: ['./folders.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterLink],
})
export class FavoritesPage implements OnInit {
  modalAberto = false;
  nomePasta = '';

  folders: string[] = [];
  constructor() {}

  ngOnInit() {}

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  criarPasta() {
    const nome = this.nomePasta.trim().toLowerCase();

    if (!nome) {
      return;
    }

    const pastaExiste = this.folders.some(
      (folder) => folder.toLowerCase() === nome,
    );

    if (pastaExiste) {
      return;
    }

    this.folders.push(nome);

    this.nomePasta = '';
    this.fecharModal();
  }
}
