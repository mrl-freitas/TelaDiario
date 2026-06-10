import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth/auth'; // 👈 ADICIONADO

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
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
export class ChangeEmailPage implements OnInit {
  // 👇 CAMPOS ADICIONADOS
  emailAtual = '';
  senha = '';
  novoEmail = '';
  isPasswordVisible = false;
  constructor(
    private authService: AuthService, // 👈 ADICIONADO
    private router: Router, // 👈 ADICIONADO
  ) {}

  ngOnInit() {}

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // 🚀 FUNÇÃO NOVA
  async alterarEmail() {
    try {
      await this.authService.alterarEmail(
        this.emailAtual,
        this.senha,
        this.novoEmail,
      );

      alert('E-mail alterado com sucesso');

      // 🔥 logout após mudança
      await this.authService.logout();

      // 🔥 volta pro login
      this.router.navigateByUrl('/login', {
        replaceUrl: true,
      });
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/wrong-password') {
        alert('Senha incorreta');
      } else if (error.code === 'auth/email-already-in-use') {
        alert('Esse e-mail já está em uso');
      } else if (error.code === 'auth/requires-recent-login') {
        alert('Faça login novamente antes de alterar o e-mail');
      } else {
        alert('Erro ao alterar e-mail');
      }
    }
  }
}
