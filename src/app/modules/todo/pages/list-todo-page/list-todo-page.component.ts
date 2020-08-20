import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { TodoQuery } from '../../models/todo.query';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteTodoComponent } from '../../components/dialog-delete-todo/dialog-delete-todo.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { Todo, SearchObject, initCompletedFilters} from '../../models/todo.model';
import { take, takeUntil } from 'rxjs/operators';
import { FormEditTodoComponent } from '../../components/form-edit-todo/form-edit-todo.component';
import { FormAddTodoComponent } from '../../components/form-add-todo/form-add-todo.component';

@Component({
  selector: 'app-list-todo-page',
  templateUrl: './list-todo-page.component.html',
})
export class ListTodoPageComponent implements OnInit, OnDestroy {
  public listTodo$: Observable<Todo[]>;
  public todoForm: FormGroup;
  public searchForm: FormGroup;
  public searchObject: SearchObject;
  public completedFilters = initCompletedFilters;

  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  private destroy$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

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
    this.todoService.getTodo().pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  public addTodo(): void {
    this.openDialogAddTodoForm();
  }

  public openDialogAddTodoForm(): void {
    const dialogTodoFormRef = this.dialog.open(FormAddTodoComponent, {
      width: '450px',
    });
    dialogTodoFormRef.afterClosed()
      .pipe(take(1))
      .subscribe((todo: Todo) => {
        if (todo){
          this.todoService.add(todo);
          const alertText = $localize`:@@alert-add-success:You have successfully added`;
          this.showAlert(alertText);
        }
      });
  }

  public updateTodo(id: string): void {
    this.todoQuery.getTodoById(id)
      .pipe(take(1))
      .subscribe((res: Todo) => {
        const todoItem = new Todo();
        todoItem.id = res.id;
        todoItem.title = res.title;
        todoItem.content = res.content;
        todoItem.creator = res.creator;
        todoItem.deadLine = res.deadLine;
        todoItem.completed = res.completed;
        this.openDialogEditTodoForm(todoItem);
      });
  }

  public openDialogEditTodoForm(todoItem?: Todo): void {
    const dialogTodoFormRef = this.dialog.open(FormEditTodoComponent, {
      width: '450px',
      data: todoItem
    });
    dialogTodoFormRef.afterClosed()
      .pipe(take(1))
      .subscribe((todo: Todo) => {
        if (todo){
          this.todoService.updateTodo(todo);
          const alertText = $localize`:@@alert-update-success:You have successfully updated`;
          this.showAlert(alertText);
        }
      });
  }

  public updateCompletedStatus(todo: Todo): void {
    this.todoService.updateTodo(todo);
    const alertText = $localize`:@@alert-update-success:You have successfully updated`;
    this.showAlert(alertText);
  }

  public deleteTodo(id: string): void {
    const dialogDeleteRef = this.dialog.open(DialogDeleteTodoComponent, {
      width: '450px',
    });
    dialogDeleteRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result === true) {
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

  ngOnDestroy(): void{
    this.destroy$.next(true);
  }
}
