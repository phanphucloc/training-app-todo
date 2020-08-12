import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import {
  Todo,
  ACTION,
  SearchObject,
  initCompletedFilters,
  ACTIONMODAL,
  ACTIONCOMFIRM,
  COMPLETED_FILTER,
} from '../../../../state-management/todo.model';
import { TodosService } from '../../../../state-management/todos.service';
import { TodosQuery } from '../../../../state-management/todos.query';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormTodoComponent } from '../form-todo/form-todo.component';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss'],
})
export class ListTodoComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public displayedColumns: string[] = [
    'title',
    'content',
    'creator',
    'completed',
    'action',
  ];

  public listTodo$: Observable<Todo[]>;

  public todoForm: FormGroup;
  public currentAction: string = ACTION.ADD;

  public searchForm: FormGroup;
  public searchObject: SearchObject;
  public completedFilters = initCompletedFilters;

  constructor(
    private todoService: TodosService,
    private todosQuery: TodosQuery,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchObject = new SearchObject();
  }

  ngOnInit(): void {
    this.getData();
    this.createForm();
    this.changeValueSearch();
  }

  getData(): void {
    this.listTodo$ = this.todosQuery.selectVisibleTodos$;
  }

  createForm(): void {
    this.searchForm = new FormGroup({
      title: new FormControl(''),
      content: new FormControl(''),
      creator: new FormControl(''),
      completed: new FormControl(COMPLETED_FILTER.INCOMPLETED),
    });

    this.todoForm = new FormGroup({
      title: new FormControl(
        '',
        [Validators.required, Validators.maxLength(40)],
        [this.todoService.validateTitle(this.getInfoCurrent.bind(this))]
      ),
      content: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
      creator: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]),
    });
  }

  addTodo(): void {
    this.currentAction = ACTION.ADD;
    this.resetFormTodo(this.currentAction);
    this.openDialogTodo();
  }

  getInfoTodo(id$: string): void {
    this.currentAction = ACTION.EDIT;
    this.resetFormTodo(this.currentAction);
    this.todosQuery.getTodoById(id$).subscribe((res: Todo) => {
      this.todoForm.setValue({
        id: res.id,
        title: res.title,
        content: res.content,
        creator: res.creator,
        completed: res.completed,
      });
      this.openDialogTodo();
    });
  }

  openDialogTodo(): void {
    const dialogRef = this.dialog.open(FormTodoComponent, {
      width: '450px',
      data: { currentAction: this.currentAction, todoForm: this.todoForm },
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === ACTIONMODAL.SUBMIT) {
        this.submit();
      } else {
        this.resetFormTodo(this.currentAction);
      }
    });
  }

  submit(): void {
    let alertText: string;
    switch (this.currentAction) {
      case ACTION.ADD:
        this.todoService.add(this.todoForm.value);
        this.resetFormTodo(this.currentAction);

        alertText = $localize`:@@alert-add-success:You have successfully added`;
        this.snackBar.open(alertText, null, {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

        break;
      default:
        this.currentAction = ACTION.ADD;
        this.todoService.updateTodo(this.todoForm.value);
        this.resetFormTodo(this.currentAction);

        alertText = $localize`:@@alert-update-success:You have successfully updated`;
        this.snackBar.open(alertText, null, {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

        break;
    }
  }

  updateCompletedStatus(value: boolean, todo: Todo): void {
    this.todoService.updateTodoComplete({ ...todo, completed: value });
    const alertText = $localize`:@@alert-update-success:You have successfully updated`;
    this.snackBar.open(alertText, null, {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  resetFormTodo(typeAction: string): void {
    this.todoForm.reset();
    switch (typeAction) {
      case ACTION.ADD:
        this.todoForm.removeControl('id');
        this.todoForm.removeControl('completed');
        break;
      default:
        this.todoForm.addControl('id', new FormControl(''));
        this.todoForm.addControl('completed', new FormControl(false));
        break;
    }
  }

  deleteTodo(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === ACTIONCOMFIRM.AGREE) {
        this.todoService.delete(id);

        const alertText = $localize`:@@alert-delete-success:You have successfully deleted`;
        this.snackBar.open(alertText, null, {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });
  }

  changeValueSearch(): void {
    combineLatest([
      this.searchForm.controls.title.valueChanges.pipe(startWith('')),
      this.searchForm.controls.content.valueChanges.pipe(startWith('')),
      this.searchForm.controls.creator.valueChanges.pipe(startWith('')),
      this.searchForm.controls.completed.valueChanges.pipe(
        startWith(COMPLETED_FILTER.INCOMPLETED)
      ),
    ])
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(([title, content, creator, completed]) => {
        const searchData = new SearchObject();
        searchData.title = title;
        searchData.content = content;
        searchData.creator = creator;
        searchData.completed = completed;
        this.todoService.updateFilter(searchData);
      });
  }

  getInfoCurrent(): any {
    return {
      currentAction: this.currentAction,
      currenttodo: this.todoForm?.value,
    };
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
