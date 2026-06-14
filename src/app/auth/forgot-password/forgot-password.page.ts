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

// --- IMPORTAÇÕES DO FIREBASE CONFIGURADAS ---
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// COLE AQUI AS SUAS CREDENCIAIS DO FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_AUTH_DOMAIN_AQUI",
  projectId: "SEU_PROJECT_ID_AQUI",
  storageBucket: "SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "SUA_APP_ID_AQUI"
};

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
      this.statusSucesso = false;
      return;
    }

    const emailDigitado = this.email.trim().toLowerCase();

    try {
      let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const db = getFirestore(app);
      const auth = getAuth(app);

      const usuariosRef = collection(db, 'users');
      const q = query(usuariosRef, where('email', '==', emailDigitado));
      const querySnapshot = await getDocs(q);

      // VERIFICAÇÃO RÍGIDA: Se o e-mail não existir na coleção do Firestore, barra aqui!
      if (querySnapshot.empty) {
        this.mensagemStatus = 'E-mail não cadastrado no sistema.';
        this.statusSucesso = false;
        return;
      }

      // Se o documento existe, dispara o e-mail com segurança
      await sendPasswordResetEmail(auth, emailDigitado);
      this.mensagemStatus = 'Link de redefinição enviado!';
      this.statusSucesso = true;
      this.email = '';

    } catch (error: any) {
      console.error('Erro completo na execução:', error);
      this.mensagemStatus = 'Erro ao processar. Tente novamente.';
      this.statusSucesso = false;
    }
  }
}
