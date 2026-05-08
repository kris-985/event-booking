import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'events'
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/pages/events-list/events-list').then((m) => m.EventsList)
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./features/events/pages/event-details/event-details').then((m) => m.EventDetails)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register').then((m) => m.Register)
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./features/bookings/pages/my-bookings/my-bookings').then((m) => m.MyBookings)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/pages/profile/profile').then((m) => m.Profile)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/pages/admin-dashboard/admin-dashboard').then(
        (m) => m.AdminDashboard
      )
  },
  {
    path: '**',
    redirectTo: 'events'
  }
];
