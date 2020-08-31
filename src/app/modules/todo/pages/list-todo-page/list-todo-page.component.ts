import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { TodoQuery } from '../../models/todo.query';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteTodoComponent } from '../../components/dialog-delete-todo/dialog-delete-todo.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { Todo, SearchObject, initCompletedFilters} from '../../models/todo.model';
import { first, takeUntil } from 'rxjs/operators';
import { FormEditTodoComponent } from '../../components/form-edit-todo/form-edit-todo.component';
import { FormAddTodoComponent } from '../../components/form-add-todo/form-add-todo.component';
import { AuthService } from 'src/app/common/services/auth.service';
import { LOCALIZE } from 'src/app/common/localize/localize.const';
import { BaseDestroyableDirective } from 'src/app/common/abstract/base-destroyable';

@Component({
  selector: 'app-list-todo-page',
  templateUrl: './list-todo-page.component.html',
  styleUrls: ['./list-todo-page.component.scss']
})
export class ListTodoPageComponent extends BaseDestroyableDirective implements OnInit {
  public listTodo$: Observable<Todo[]>;
  public loading$: Observable<boolean>;
  public todoForm: FormGroup;
  public searchForm: FormGroup;
  public searchObject: SearchObject;
  public completedFilters = initCompletedFilters;

  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private todoService: TodoService,
    private todoQuery: TodoQuery,
    private snackBar: MatSnackBar,
  ) {
    super();
    this.searchObject = new SearchObject();
  }

  public ngOnInit(): void {
    this.loading$ = this.todoQuery.selectLoading();
    this.listTodo$ = this.todoQuery.selectVisibleTodo();
    this.todoService.getTodo()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((res) => res, (err) => {
        this.showAlert(err);
      });
  }

  public addTodo(): void {
    this.openDialogAddTodoForm();
  }

  public openDialogAddTodoForm(): void {
    const dialogTodoFormRef = this.dialog.open(
      FormAddTodoComponent,
    );

    dialogTodoFormRef.afterClosed()
      .pipe(first())
      .subscribe((todo: Todo) => {
        if (todo){
          this.todoService.add(todo)
            .subscribe(res => {
              this.showAlert(LOCALIZE.ALERT_ADD_SUCCESS);
            }, err => {
              this.showAlert(err.message);
            });
        }
      });
  }

  public updateTodo(id: string): void {
    this.todoQuery.getTodoById(id)
      .pipe(first())
      .subscribe((res: Todo) => {
        this.openDialogEditTodoForm(res);
      });
  }

  public openDialogEditTodoForm(todoItem?: Todo): void {
    const dialogTodoFormRef = this.dialog.open(
      FormEditTodoComponent,
      {
        data: todoItem
      }
    );

    dialogTodoFormRef.afterClosed()
      .pipe(first())
      .subscribe((todo: Todo) => {
        if (todo){
          this.todoService.updateTodo(todo)
            .subscribe(() => {
              this.showAlert(LOCALIZE.ALERT_UPDATE_SUCCESS);
            }, err => {
              this.showAlert(err.message);
            });
        }
      });
  }

  public updateCompletedStatus(todo: Todo): void {
    this.todoService.updateTodo(todo)
      .pipe(first())
      .subscribe(() => {
        this.showAlert(LOCALIZE.ALERT_UPDATE_SUCCESS);
      }, err => {
        this.showAlert(err.message);
      });
  }

  public deleteTodo(id: string): void {
    const dialogDeleteRef = this.dialog.open(
      DialogDeleteTodoComponent,
    );

    dialogDeleteRef.afterClosed()
      .pipe(first())
      .subscribe((result: boolean) => {
        if (result === true) {
          this.todoService.delete(id)
            .subscribe(() => {
              this.showAlert(LOCALIZE.ALERT_DELETE_DELETE);
            }, err => {
              this.showAlert(err.message);
            });
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
