import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
  ],
})
export class ChangePasswordPage implements OnInit {
  // =========================
  // STATE (inputs)
  // =========================
  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';

  // =========================
  // UI STATE (visibility)
  // =========================
  isCurrentPasswordVisible = false;
  isNewPasswordVisible = false;
  isConfirmPasswordVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // =========================
  // LIFECYCLE
  // =========================
  ngOnInit(): void {}

  // =========================
  // PASSWORD VISIBILITY TOGGLES
  // =========================
  toggleCurrentPassword(): void {
    this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
  }

  toggleNewPassword(): void {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  toggleConfirmPassword(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  // =========================
  // ACTIONS
  // =========================
  async trocarSenha(): Promise<void> {
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      alert('Preencha todos os campos');
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      alert('As senhas não conferem');
      return;
    }

    try {
      await this.authService.alterarSenha(this.senhaAtual, this.novaSenha);

      alert('Senha alterada com sucesso! Faça login novamente.');

      this.limparCampos();

      // 🔥 importante: redirecionar após logout automático
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.tratarErroSenha(error);
    }
  }

  // =========================
  // HELPERS
  // =========================
  private limparCampos(): void {
    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarSenha = '';
  }

  private tratarErroSenha(error: any): void {
    console.error(error);

    switch (error?.code) {
      case 'auth/wrong-password':
        alert('Senha atual incorreta');
        break;

      case 'auth/weak-password':
        alert('Senha muito fraca');
        break;

      default:
        alert('Erro ao alterar senha');
        break;
    }
  }
}
