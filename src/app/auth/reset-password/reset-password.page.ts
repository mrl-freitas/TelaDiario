import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
} from '@ionic/angular/standalone';

import { getAuth, confirmPasswordReset } from 'firebase/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonItem,
  ],
})
export class ResetPasswordPage implements OnInit {
  isPasswordVisibleA = false;
  isPasswordVisibleB = false;

  password = '';
  confirmPassword = '';
  oobCode = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.oobCode = this.route.snapshot.queryParamMap.get('code') || '';
  }

  togglePasswordA() {
    this.isPasswordVisibleA = !this.isPasswordVisibleA;
  }

  togglePasswordB() {
    this.isPasswordVisibleB = !this.isPasswordVisibleB;
  }

  async alterarSenha() {
    if (!this.password || !this.confirmPassword) {
      alert('Preencha todos os campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('As senhas não conferem');
      return;
    }

    try {
      await confirmPasswordReset(getAuth(), this.oobCode, this.password);

      alert('Senha alterada com sucesso!');

      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
      alert('Link inválido ou expirado');
    }
  }
}
