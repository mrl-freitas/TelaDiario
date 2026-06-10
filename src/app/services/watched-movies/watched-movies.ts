import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  collectionData,
} from '@angular/fire/firestore';

import { Auth, user } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of, firstValueFrom } from 'rxjs';
import { runInInjectionContext, Injector } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WatchedMoviesService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  private user$ = user(this.auth);

  // 🔥 STREAM DO FIRESTORE
  private watched$ = this.user$.pipe(
    switchMap((u) => {
      if (!u) return of([]);

      return runInInjectionContext(this.injector, () => {
        const ref = collection(this.firestore, `users/${u.uid}/watchedMovies`);
        return collectionData(ref);
      });
    }),
  );

  watched = toSignal(this.watched$, { initialValue: [] });

  // 🔥 CHECK SIMPLES
  isWatched(id: number | string): boolean {
    return this.watched().some((m: any) => String(m.movieId) === String(id));
  }

  // 🔥 TOGGLE
  async toggle(movie: any) {
    const u = await firstValueFrom(this.user$);
    if (!u) return;

    const movieId = String(movie.id);

    const ref = doc(this.firestore, `users/${u.uid}/watchedMovies/${movieId}`);

    const exists = this.isWatched(movieId);

    if (exists) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        movieId,
        title: movie.title || movie.name,
        poster: movie.poster_path,
        createdAt: new Date(),
      });
    }
  }
}
