import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoRoutingModule } from './todo-routing.module';
import { ListTodoComponent } from './components/list-todo/list-todo.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormTodoComponent } from './components/form-todo/form-todo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [ListTodoComponent, FormTodoComponent],
  imports: [
    MatSnackBarModule,
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
    MatCardModule,
    MatIconModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TodoModule {}
