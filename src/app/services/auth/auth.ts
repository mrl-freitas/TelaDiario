import { Injectable, inject } from '@angular/core';
import { Auth, authState, updatePassword } from '@angular/fire/auth';

// 📦 Importações modulares do Firebase e Firestore ajustadas
import {
  Firestore,
  doc,
  setDoc
} from '@angular/fire/firestore';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';

import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$: Observable<User | null> = authState(this.auth);

  // 🚀 1. LÓGICA DE CADASTRO (Gera o documento com e-mail automático no Firestore)
  async registrar(email: string, senha: string) {
    const emailTratado = email.trim().toLowerCase();

    // Cria no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(this.auth, emailTratado, senha);
    const uid = userCredential.user.uid;

    // Salva automaticamente na coleção 'users' do Firestore
    const userDocRef = doc(this.firestore, 'users', uid);
    await setDoc(userDocRef, {
      uid: uid,
      email: emailTratado,
      criadoEm: new Date()
    });

    return userCredential;
  }

  // 🔑 2. LOGIN
  login(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  // 🚪 3. LOGOUT
  logout() {
    return signOut(this.auth);
  }

  // 🔄 4. ALTERAR EMAIL (Versão Definitiva: Cria o documento se não existir, ou atualiza se já existir)
  async alterarEmail(novoEmail: string, emailAtual: string, senhaAtual: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    const emailTratado = novoEmail.trim().toLowerCase();

    try {
      // Define a referência direta usando o UID exato do usuário autenticado no app
      const userDocRef = doc(this.firestore, 'users', user.uid);

      // 🔥 O PULO DO GATO: setDoc com merge: true resolve o problema de documentos inexistentes
      await setDoc(userDocRef, {
        uid: user.uid,
        email: emailTratado,
        atualizadoEm: new Date()
      }, { merge: true });

      console.log('Fatality! Campo email sincronizado com sucesso no Firestore.');
    } catch (error) {
      console.error('Erro crítico ao salvar o e-mail no Firestore:', error);
      throw error;
    }
  }

  // 🔐 5. ALTERAR SENHA (Mantém a reautenticação nativa protetiva do Firebase)
  async alterarSenha(senhaAtual: string, novaSenha: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    // Reautentica usando o EmailAuthProvider correto do Firebase
    const credential = EmailAuthProvider.credential(user.email!, senhaAtual);
    await reauthenticateWithCredential(user, credential);

    // Aplica a nova senha criptografada
    await updatePassword(user, novaSenha);
  }
}
