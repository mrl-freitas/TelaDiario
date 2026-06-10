import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonInputPasswordToggle,
  ToastController,
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonItem,
    RouterLink,
  ],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  isPasswordVisible = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  ngOnInit() {}

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);

      const toast = await this.toastCtrl.create({
        message: 'Login realizado com sucesso!',
        duration: 2000,
        color: 'success',
      });

      await toast.present();

      this.router.navigateByUrl('/home');
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erro ao fazer login',
        duration: 2000,
        color: 'danger',
      });

      await toast.present();

      console.error(error);
    }
  }
}
