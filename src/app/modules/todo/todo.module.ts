import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoRoutingModule } from './todo-routing.module';
import { ListTodoComponent } from './components/list-todo/list-todo.component';
import { TranslateModule } from '@ngx-translate/core';
import { ParamsTranslatePipe } from '../../common/pipe/params-translate.pipe';
import { FormTodoComponent } from './components/form-todo/form-todo.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    ParamsTranslatePipe,
    ListTodoComponent,
    FormTodoComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TodoRoutingModule,
    TranslateModule,
    MatDialogModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule
  ]
})
export class TodoModule { }
