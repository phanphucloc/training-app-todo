import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoRoutingModule } from './todo-routing.module';
import { ListTodoComponent } from './components/list-todo/list-todo.component';


@NgModule({
  declarations: [ListTodoComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TodoRoutingModule
  ]
})
export class TodoModule { }
