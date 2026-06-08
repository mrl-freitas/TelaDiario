import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },

      {
        path: 'categories',
        loadComponent: () =>
          import('../pages/categories/categories.page').then(
            (m) => m.CategoriesPage,
          ),
      },

      {
        path: 'search',
        loadComponent: () =>
          import('../pages/search/search.page').then((m) => m.SearchPage),
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile/profile.page').then((m) => m.ProfilePage),
      },

      {
        path: 'movie-details',
        loadComponent: () =>
          import('../pages/movie-details/movie-details.page').then(
            (m) => m.MovieDetailsPage,
          ),
      },

      {
        path: 'movie-list/:type/:genreId',
        loadComponent: () =>
          import('../pages/movie-list/movie-list.page').then(
            (m) => m.MovieListPage,
          ),
      },

      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
