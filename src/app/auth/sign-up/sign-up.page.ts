import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonItem,
    RouterLink,
    RouterModule,
  ],
})
export class SignUpPage implements OnInit {
  constructor(private authService: AuthService) {}

  email = '';
  password = '';
  confirmPassword = '';

  async cadastrar() {
    try {
      if (this.password !== this.confirmPassword) {
        console.log('Senhas não conferem');
        return;
      }

      const userCredential = await this.authService.registrar(
        this.email,
        this.password,
      );

      console.log('Usuário criado:', userCredential.user.uid);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  }

  isPasswordVisibleA = false;
  togglePasswordA() {
    this.isPasswordVisibleA = !this.isPasswordVisibleA;
  }

  isPasswordVisibleB = false;
  togglePasswordB() {
    this.isPasswordVisibleB = !this.isPasswordVisibleB;
  }
  ngOnInit() {}
}
