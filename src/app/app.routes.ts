import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./auth/sign-up/sign-up.page').then((m) => m.SignUpPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage,
      ),
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./profile//settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'movie-genres',
    loadComponent: () =>
      import('./pages/movie-genres/movie-genres.page').then(
        (m) => m.GenresPage,
      ),
  },
  {
    path: 'anime-genres',
    loadComponent: () =>
      import('./pages/animes-genres/animes-genres.page').then(
        (m) => m.AnimeGenresPage,
      ),
  },
  {
    path: 'series-genres',
    loadComponent: () =>
      import('./pages/series-genres/series-genres.page').then(
        (m) => m.SeriesGenresPage,
      ),
  },
];
