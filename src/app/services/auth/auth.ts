import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';

import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  // ✅ FIX DEFINITIVO
  user$: Observable<User | null> = authState(this.auth);

  registrar(email: string, senha: string) {
    return createUserWithEmailAndPassword(this.auth, email, senha);
  }

  login(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  logout() {
    return signOut(this.auth);
  }

  async alterarSenha(senhaAtual: string, novaSenha: string) {
    const user = this.auth.currentUser;

    if (!user || !user.email) {
      throw new Error('Usuário não autenticado');
    }

    const credential = EmailAuthProvider.credential(user.email, senhaAtual);

    await reauthenticateWithCredential(user, credential);
    return updatePassword(user, novaSenha);
  }

  async alterarEmail(emailAtual: string, senha: string, novoEmail: string) {
    const user = this.auth.currentUser;

    if (!user || !user.email) {
      throw new Error('Usuário não autenticado');
    }

    const credential = EmailAuthProvider.credential(user.email, senha);

    await reauthenticateWithCredential(user, credential);
    return verifyBeforeUpdateEmail(user, novoEmail);
  }
}
