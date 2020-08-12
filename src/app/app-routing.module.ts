import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateDefaultComponent } from './common/template/template-default/template-default.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'page/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TemplateDefaultComponent,
    children: [
      {
        path: 'todo',
        loadChildren: () => import('./modules/todo/todo.module').then(m => m.TodoModule)
      },
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'page',
        loadChildren: () => import('./modules/pages/pages.module').then(m => m.PagesModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'page/home',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
