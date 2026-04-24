import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'preliminary-home', // Nome do 'path' da sua página inicial
    pathMatch: 'full',
  },

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },

  {
    path: 'preliminary-home',
    loadComponent: () =>
      import('./preliminary-home/preliminary-home.page').then(
        (m) => m.PreliminaryHomePage,
      ),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.page').then(
        (m) => m.CategoriesPage,
      ),
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
    path: 'group',
    loadComponent: () => import('./group/group.page').then((m) => m.GroupPage),
  },
];
