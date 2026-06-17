import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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

  {
    path: 'settings',
    loadComponent: () =>
      import('./profile/account-settings/account-settings.page').then(
        (m) => m.AccountSettingsPage,
      ),
  },
  {
    path: 'change-email',
    loadComponent: () =>
      import('./profile/change-email/change-email.page').then(
        (m) => m.ChangeEmailPage,
      ),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./profile/change-password/change-password.page').then(
        (m) => m.ChangePasswordPage,
      ),
  },
  {
    path: 'folders',
    loadComponent: () =>
      import('./profile/folders/folders.page').then((m) => m.FavoritesPage),
  },

  {
    path: 'folder-details/:id',
    loadComponent: () =>
      import('./profile/folder-details/folder-details.page').then(
        (m) => m.FolderDetailsPage,
      ),
  },  {
    path: 'group',
    loadComponent: () => import('./group/group/group.page').then( m => m.GroupPage)
  },

];
