import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { TodoQuery } from '../../models/todo.query';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormAddAndEditTodoComponent } from '../../components/form-add-and-edit-todo/form-add-and-edit-todo.component';
import { DialogDeleteTodoComponent } from '../../components/dialog-delete-todo/dialog-delete-todo.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  Todo,
  ACTION,
  SearchObject,
  initCompletedFilters,
  ResultTodoForm,
  ACTION_DIALOG,
} from '../../models/todo.model';

@Component({
  selector: 'app-list-todo-page',
  templateUrl: './list-todo-page.component.html',
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
    this.openDialogTodoForm(ACTION.ADD, null);
  }

  public updateTodo(id: string): void {
    this.todoQuery.getTodoById(id).subscribe((res: Todo) => {
      const todoItem = new Todo();
      todoItem.id = res.id;
      todoItem.title = res.title;
      todoItem.content = res.content;
      todoItem.creator = res.creator;
      todoItem.deadLine = res.deadLine;
      todoItem.completed = res.completed;
      this.openDialogTodoForm(ACTION.EDIT, todoItem);
    });
  }

  public openDialogTodoForm(currentAction, todoItem?: Todo): void {
    const dialogTodoFormRef = this.dialog.open(FormAddAndEditTodoComponent, {
      width: '450px',
      data: {
        currentAction,
        todo: todoItem,
      },
    });
    dialogTodoFormRef.afterClosed().subscribe((result: ResultTodoForm) => {
      if (result.actionDialog === ACTION_DIALOG.SUBMIT) {
        let alertText: string;
        switch (result.currentAction) {
          case ACTION.ADD:
            this.todoService.add(result.todo);
            alertText = $localize`:@@alert-add-success:You have successfully added`;
            this.showAlert(alertText);
            break;
          case ACTION.EDIT:
            this.todoService.updateTodo(result.todo);
            alertText = $localize`:@@alert-update-success:You have successfully updated`;
            this.showAlert(alertText);
            break;
        }
      }
    });
  }

  public updateCompletedStatus(todo: Todo): void {
    this.todoService.updateTodoComplete(todo);
    const alertText = $localize`:@@alert-update-success:You have successfully updated`;
    this.showAlert(alertText);
  }

  public deleteTodo(id: string): void {
    const dialogDeleteRef = this.dialog.open(DialogDeleteTodoComponent, {
      width: '450px',
    });
    dialogDeleteRef.afterClosed().subscribe((result: string) => {
      if (result === ACTION_DIALOG.AGREE) {
        this.todoService.delete(id);
        const alertText = $localize`:@@alert-delete-success:You have successfully deleted`;
        this.showAlert(alertText);
      }
    });
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
}
