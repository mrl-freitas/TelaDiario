import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
} from '@ionic/angular/standalone';

// Firebase
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
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
export class ForgotPasswordPage implements OnInit {
  email: string = '';
  mensagemStatus: string = '';
  statusSucesso: boolean = false;

  constructor() {}

  ngOnInit() {}

  async enviarEmail() {
    this.mensagemStatus = '';
    this.statusSucesso = false;

    if (this.email.trim() === '') {
      this.mensagemStatus = 'Por favor, informe seu e-mail.';
      return;
    }

    const emailDigitado = this.email.trim().toLowerCase();

    try {
      const db = getFirestore();
      const auth = getAuth();

      const usuariosRef = collection(db, 'users');
      const q = query(usuariosRef, where('email', '==', emailDigitado));
      const querySnapshot = await getDocs(q);

      // Verifica se o e-mail existe na coleção users
      if (querySnapshot.empty) {
        this.mensagemStatus = 'E-mail não cadastrado no sistema.';
        this.statusSucesso = false;
        return;
      }

      // Envia o e-mail de redefinição
      await sendPasswordResetEmail(auth, emailDigitado);

      this.mensagemStatus = 'Link de redefinição enviado!';
      this.statusSucesso = true;
      this.email = '';
    } catch (error) {
      console.error('Erro completo na execução:', error);

      this.mensagemStatus = 'Erro ao processar. Tente novamente.';
      this.statusSucesso = false;
    }
  }
}
