import {
  Injectable,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collectionData,
} from '@angular/fire/firestore';

import { Observable, of, switchMap } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../auth/auth';
import { Folder } from '../../models/folder/folder.model';

@Injectable({ providedIn: 'root' })
export class FolderService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private injector = inject(Injector);

  listarPastas(): Observable<Folder[]> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);

        return runInInjectionContext(this.injector, () => {
          const ref = collection(this.firestore, `users/${user.uid}/folders`);

          return collectionData(ref, { idField: 'id' }) as Observable<Folder[]>;
        });
      }),
    );
  }

  async criarPasta(nome: string) {
    const user = await firstValueFrom(this.authService.user$);
    if (!user) throw new Error('Sem usuário');

    return runInInjectionContext(this.injector, () =>
      addDoc(collection(this.firestore, `users/${user.uid}/folders`), {
        nome,
        createdAt: serverTimestamp(),
      }),
    );
  }

  async renomearPasta(id: string, nome: string) {
    const user = await firstValueFrom(this.authService.user$);
    if (!user) throw new Error('Sem usuário');

    return runInInjectionContext(this.injector, () =>
      updateDoc(doc(this.firestore, `users/${user.uid}/folders/${id}`), {
        nome,
      }),
    );
  }

  async apagarPasta(id: string) {
    const user = await firstValueFrom(this.authService.user$);
    if (!user) throw new Error('Sem usuário');

    return runInInjectionContext(this.injector, () =>
      deleteDoc(doc(this.firestore, `users/${user.uid}/folders/${id}`)),
    );
  }
}
