import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo/list',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'todo',
        loadChildren: () => import('./modules/todo/todo.module').then((m) => m.TodoModule),
      },
      {
        path: 'auth',
        loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'todo/list',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
