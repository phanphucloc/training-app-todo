import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoRoutingModule } from './todo-routing.module';
import { ListTodoComponent } from './components/list-todo/list-todo.component';
import { TranslateModule } from '@ngx-translate/core';
import { ParamsTranslatePipe } from '../../common/pipe/params-translate.pipe';


@NgModule({
  declarations: [
    ParamsTranslatePipe,
    ListTodoComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TodoRoutingModule,
    TranslateModule
  ]
})
export class TodoModule { }
