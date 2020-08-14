import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Todo,
  ACTION,
  SearchObject,
  initCompletedFilters,
  ResultFormTodo,
  ACTION_DIALOG,
} from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { TodoQuery } from '../../models/todo.query';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormAddAndEditTodoComponent } from '../../components/form-add-and-edit-todo/form-add-and-edit-todo.component';

@Component({
  selector: 'app-list-todo-page',
  templateUrl: './list-todo.component.html',
})
export class ListTodoPageComponent implements OnInit {
  public displayedColumns: string[] = [
    'title',
    'content',
    'creator',
    'completed',
    'action',
  ];
  public listTodo$: Observable<Todo[]>;
  public todoForm: FormGroup;
  public searchForm: FormGroup;
  public searchObject: SearchObject;
  public completedFilters = initCompletedFilters;

  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialog: MatDialog,
    private todoService: TodoService,
    private todoQuery: TodoQuery,
    private snackBar: MatSnackBar
  ) {
    this.searchObject = new SearchObject();
  }

  ngOnInit(): void {
    this.listTodo$ = this.todoQuery.selectVisibleTodo();
  }

  public addTodo(): void {
    const dialogRef = this.dialog.open(FormAddAndEditTodoComponent, {
      width: '450px',
      data: { currentAction: ACTION.ADD, todo: null },
    });
    dialogRef.afterClosed().subscribe((result: ResultFormTodo) => {
      let alertText: string;
      if (result.actionDialog === ACTION_DIALOG.SUBMIT) {
        this.todoService.add(result.todo);
        alertText = $localize`:@@alert-add-success:You have successfully added`;
        this.showAlert(alertText);
      }
    });
  }

  public updateTodo(todo: Todo): void {
    this.todoService.updateTodo(todo);
    const alertText = $localize`:@@alert-update-success:You have successfully updated`;
    this.showAlert(alertText);
  }

  public updateCompletedStatus(todo: Todo): void {
    this.todoService.updateTodoComplete(todo);
    const alertText = $localize`:@@alert-update-success:You have successfully updated`;
    this.showAlert(alertText);
  }

  public deleteTodo(id: string): void {
    this.todoService.delete(id);
    const alertText = $localize`:@@alert-delete-success:You have successfully deleted`;
    this.showAlert(alertText);
  }

  public showAlert(alertText: string): void {
    this.snackBar.open(alertText, null, {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  public changeFilterValue(filter: SearchObject): void {
    this.todoService.updateFilter(filter);
  }

  public trackByFn(index: number, item: any): number {
    return item.id;
  }
}
