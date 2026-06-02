import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  settingsOutline,
  starOutline,
  chevronForwardOutline,
  logOutOutline,
  chevronBackOutline,
  addOutline,
  mailOutline,
  lockClosedOutline,
  eyeOffOutline // Novo ícone para simular o ocultar senha
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonBackButton,
    CommonModule,
    FormsModule,
    NgIf,
    NgFor
  ]
})
export class ProfilePage implements OnInit {
  isLoggedIn: boolean = false;
  showLogoutModal: boolean = false;
  showMyList: boolean = false;
  showSettings: boolean = false;
  showChangeEmail: boolean = false;

  // Nova variável para controlar a exibição da tela "Alterar Senha"
  showChangePassword: boolean = false;

  showCreateFolderModal: boolean = false;
  newFolderName: string = '';
  folders: string[] = [];

  constructor() {
    addIcons({
      personCircleOutline,
      settingsOutline,
      starOutline,
      chevronForwardOutline,
      logOutOutline,
      chevronBackOutline,
      addOutline,
      mailOutline,
      lockClosedOutline,
      eyeOffOutline
    });
  }

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('user_logado') === 'true';
    if (this.isLoggedIn) {
      const savedFolders = localStorage.getItem('pastas_usuario');
      if (savedFolders) {
        this.folders = JSON.parse(savedFolders);
      }
    }
  }

  simularLogin() {
    localStorage.setItem('user_logado', 'true');
    this.isLoggedIn = true;
    const savedFolders = localStorage.getItem('pastas_usuario');
    this.folders = savedFolders ? JSON.parse(savedFolders) : [];
  }

  abrirConfirmacaoLogout() {
    this.showLogoutModal = true;
  }

  confirmarSair() {
    localStorage.removeItem('user_logado');
    this.isLoggedIn = false;
    this.showLogoutModal = false;
    this.showMyList = false;
    this.showSettings = false;
    this.showChangeEmail = false;
    this.showChangePassword = false; // Reseta o estado ao deslogar
    this.folders = [];
  }

  cancelarSair() {
    this.showLogoutModal = false;
  }

  irParaMinhaLista() {
    this.showMyList = true;
    this.showSettings = false;
    this.showChangeEmail = false;
    this.showChangePassword = false;
  }

  irParaConfiguracoes() {
    this.showSettings = true;
    this.showMyList = false;
    this.showChangeEmail = false;
    this.showChangePassword = false;
  }

  irParaAlterarEmail() {
    this.showChangeEmail = true;
    this.showSettings = false;
    this.showMyList = false;
    this.showChangePassword = false;
  }

  // Função para abrir a tela de alterar senha
  irParaAlterarSenha() {
    this.showChangePassword = true;
    this.showSettings = false;
    this.showMyList = false;
    this.showChangeEmail = false;
  }

  // Modificado para gerenciar o retorno de e-mail e de senha de volta para as configurações
  voltarParaPerfil() {
    if (this.showChangeEmail || this.showChangePassword) {
      this.showChangeEmail = false;
      this.showChangePassword = false;
      this.showSettings = true; // Ambos voltam para o menu de configurações
    } else {
      this.showMyList = false;
      this.showSettings = false;
    }
  }

  abrirModalPasta() {
    this.showCreateFolderModal = true;
    this.newFolderName = '';
  }

  fecharModalPasta() {
    this.showCreateFolderModal = false;
  }

  criarNovaPasta() {
    if (this.newFolderName.trim().length > 0) {
      this.folders.push(this.newFolderName.trim());
      localStorage.setItem('pastas_usuario', JSON.stringify(this.folders));
      this.newFolderName = '';
      this.showCreateFolderModal = false;
    }
  }
}
