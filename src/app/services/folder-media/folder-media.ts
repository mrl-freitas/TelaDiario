import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from '@angular/fire/firestore';

import { firstValueFrom } from 'rxjs';
import { switchMap, of } from 'rxjs';

type FirebaseUser = { uid: string } | null;

@Injectable({
  providedIn: 'root',
})
export class FolderMediaService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private user$ = authState(this.auth);

  // =========================
  // 👤 USER
  // =========================
  private async getUser(): Promise<FirebaseUser> {
    return await firstValueFrom(this.user$);
  }

  // =========================
  // 🧼 NORMALIZAÇÃO
  // =========================
  private normalize(media: any) {
    return {
      mediaId: media.id,
      titulo: media.title || media.name || 'Sem título',
      imagem: media.poster_path || media.backdrop_path || null,
      media_type: media.media_type || 'movie',
      createdAt: Date.now(),
    };
  }

  // =========================
  // ➕ ADD MEDIA
  // =========================
  async adicionarMedia(folderId: string, media: any) {
    const user = await this.getUser();
    if (!user) return;

    const ref = doc(
      this.firestore,
      `users/${user.uid}/folders/${folderId}/media/${media.id}`,
    );

    return setDoc(ref, this.normalize(media));
  }

  // =========================
  // ❌ REMOVE MEDIA
  // =========================
  async removerMedia(folderId: string, mediaId: number) {
    const user = await this.getUser();
    if (!user) return;

    const ref = doc(
      this.firestore,
      `users/${user.uid}/folders/${folderId}/media/${mediaId}`,
    );

    return deleteDoc(ref);
  }

  // =========================
  // 📄 LIST MEDIA (REACTIVO)
  // =========================
  listarMidias(folderId: string) {
    return this.user$.pipe(
      switchMap((user: any) => {
        if (!user) return of([]);

        const ref = collection(
          this.firestore,
          `users/${user.uid}/folders/${folderId}/media`,
        );

        return collectionData(ref, { idField: 'id' });
      }),
    );
  }

  // =========================
  // 🔎 EXISTS MEDIA
  // =========================
  async mediaExiste(folderId: string, mediaId: number) {
    const user = await this.getUser();
    if (!user) return false;

    const ref = doc(
      this.firestore,
      `users/${user.uid}/folders/${folderId}/media/${mediaId}`,
    );

    const snap = await getDoc(ref);
    return snap.exists();
  }

  // =========================
  // 🔁 TOGGLE MEDIA
  // =========================
  async toggleMedia(folderId: string, media: any) {
    const existe = await this.mediaExiste(folderId, media.id);

    return existe
      ? this.removerMedia(folderId, media.id)
      : this.adicionarMedia(folderId, media);
  }

  // =========================
  // ❤️ GLOBAL CHECK (CORRIGIDO)
  // =========================
  async isFavoriteGlobal(mediaId: number) {
    const user = await this.getUser();
    if (!user) return false;

    const foldersRef = collection(this.firestore, `users/${user.uid}/folders`);

    const foldersSnap = await firstValueFrom(
      collectionData(foldersRef, { idField: 'id' }),
    );

    for (const folder of foldersSnap as any[]) {
      const ref = doc(
        this.firestore,
        `users/${user.uid}/folders/${folder.id}/media/${mediaId}`,
      );

      const snap = await getDoc(ref);

      if (snap.exists()) {
        return true;
      }
    }

    return false;
  }
}
