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
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-list-todo-page',
  templateUrl: './list-todo-page.component.html',
  styleUrls: ['./list-todo-page.component.scss']
})
export class ListTodoPageComponent implements OnInit, OnDestroy {
  public listTodo$: Observable<Todo[]>;
  public loading$: Observable<boolean>;
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
    private snackBar: MatSnackBar,
    public authService: AuthService,
  ) {
    this.searchObject = new SearchObject();
  }

  ngOnInit(): void {
    this.loading$ = this.todoQuery.selectLoading();
    this.listTodo$ = this.todoQuery.selectVisibleTodo();
    this.todoService.getTodo()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((res) => res, (err) => {
        this.showAlert(err);
        this.authService.logout();
      });
  }

  public addTodo(): void {
    console.log(this.authService.user);
    this.openDialogAddTodoForm();
  }

  public openDialogAddTodoForm(): void {
    const dialogTodoFormRef = this.dialog.open(
      FormAddTodoComponent,
    );

    dialogTodoFormRef.afterClosed()
      .pipe(take(1))
      .subscribe((todo: Todo) => {
        if (todo){
          this.todoService.add(todo)
            .then(res => {
              const alertText = $localize`:@@alert-add-success:You have successfully added`;
              this.showAlert(alertText);
            })
            .catch(err => {
              this.showAlert(err.message);
              this.authService.logout();
            });
        }
      });
  }

  public updateTodo(id: string): void {
    this.todoQuery.getTodoById(id)
      .pipe(take(1))
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
      .pipe(take(1))
      .subscribe((todo: Todo) => {
        if (todo){
          this.todoService.updateTodo(todo)
            .then(res => {
              const alertText = $localize`:@@alert-update-success:You have successfully updated`;
              this.showAlert(alertText);
            })
            .catch(err => {
              this.showAlert(err.message);
              this.authService.logout();
            });
        }
      });
  }

  public updateCompletedStatus(todo: Todo): void {
    this.todoService.updateTodo(todo)
      .then(res => {
        const alertText = $localize`:@@alert-update-success:You have successfully updated`;
        this.showAlert(alertText);
      })
      .catch(err => {
        console.log(todo);
        this.showAlert(err.message);
        this.authService.logout();
      });
  }

  public deleteTodo(id: string): void {
    const dialogDeleteRef = this.dialog.open(
      DialogDeleteTodoComponent,
    );

    dialogDeleteRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result === true) {
          this.todoService.delete(id)
            .then(res => {
              const alertText = $localize`:@@alert-delete-success:You have successfully deleted`;
              this.showAlert(alertText);
            })
            .catch(err => {
              this.showAlert(err.message);
              this.authService.logout();
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

  ngOnDestroy(): void{
    this.destroy$.next(true);
  }
}
