import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  collectionData,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);

  salvarUsuario(dados: any) {
    const ref = collection(this.firestore, 'usuarios');

    return addDoc(ref, dados);
  }

  listarUsuarios(): Observable<any[]> {
    const ref = collection(this.firestore, 'usuarios');

    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }
}
