import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoRoutingModule } from './todo-routing.module';
import { TranslateModule } from '@ngx-translate/core';
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
import { FilterTodoComponent } from './components/filter-todo/filter-todo.component';
import { ListTodoComponent } from './components/list-todo/list-todo.component';
import { ListTodoPageComponent } from './pages/list-todo-page/list-todo-page.component';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormEditTodoComponent } from './components/form-edit-todo/form-edit-todo.component';
import { FormAddTodoComponent } from './components/form-add-todo/form-add-todo.component';
import { DialogDeleteTodoComponent } from './components/dialog-delete-todo/dialog-delete-todo.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ListTodoPageComponent,
    FormEditTodoComponent,
    FormAddTodoComponent,
    DialogDeleteTodoComponent,
    FilterTodoComponent,
    ListTodoComponent,
    FormEditTodoComponent,
  ],
  imports: [
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
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
