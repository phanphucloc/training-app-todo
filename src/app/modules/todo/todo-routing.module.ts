import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTodoPageComponent } from './pages/list-todo-page/list-todo-page.component';
import { AuthGuard } from 'src/app/common/guard/auth.guard';

const routes: Routes = [
  {
    path: 'list',
    component: ListTodoPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
