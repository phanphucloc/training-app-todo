import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTodoComponent } from './components/list-todo/list-todo.component';
import { FormTodoComponent } from './components/form-todo/form-todo.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListTodoComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
