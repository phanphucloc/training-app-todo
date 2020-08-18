import { TodoQuery } from '../../models/todo.query';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import {
  DataTodoForm,
  ACTION,
  Todo,
  ACTION_DIALOG,
  ResultTodoForm,
} from '../../models/todo.model';
import {
  FormGroup,
  FormControl,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-form-add-and-edit-todo',
  templateUrl: './form-add-and-edit-todo.component.html',
})
export class FormAddAndEditTodoComponent implements OnInit {
  public todoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormAddAndEditTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataTodoForm,
    private todoQuery: TodoQuery,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    switch (this.data.currentAction) {
      case ACTION.ADD:
        this.createFormAdd();
        break;
      case ACTION.EDIT:
        this.createFormEdit();
        break;
    }
  }

  public createFormAdd(): void {
    this.todoForm = new FormGroup({
      title: new FormControl(
        '',
        [Validators.required, Validators.maxLength(40)],
        [this.validateTitle()]
      ),
      content: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
      creator: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]),
      deadLine: new FormControl(null),
    });
  }

  public createFormEdit(): void {
    this.todoForm = new FormGroup({
      id: new FormControl(this.data.todo?.id),
      title: new FormControl(
        this.data.todo?.title,
        [Validators.required, Validators.maxLength(40)],
        [this.validateTitle()]
      ),
      content: new FormControl(this.data.todo?.content, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      creator: new FormControl(this.data.todo?.creator, [
        Validators.required,
        Validators.maxLength(25),
      ]),
      deadLine: new FormControl(this.data.todo?.deadLine),
      completed: new FormControl(this.data.todo?.completed),
    });
    this.cdr.detectChanges();
  }

  public submit(): void {
    const result = new ResultTodoForm();
    result.currentAction = this.data.currentAction;
    result.actionDialog = ACTION_DIALOG.SUBMIT;
    result.todo = this.todoForm.value;
    this.dialogRef.close(result);
  }

  public cancel(): void {
    const result = new ResultTodoForm();
    result.currentAction = this.data.currentAction;
    result.actionDialog = ACTION_DIALOG.CANCEL;
    result.todo = null;
    this.dialogRef.close(result);
  }

  public limitDay(day: Date | null): boolean {
    const datepickerDay = day || new Date();
    const datepickerTime = datepickerDay.getTime();
    const currentTime = new Date(new Date().toDateString()).getTime();
    return datepickerTime >= currentTime;
  }

  private validateTitle(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      if (control.value) {
        return this.todoQuery.getTodoByTitle(control.value).pipe(
          distinctUntilChanged(),
          map((res: Todo) => {
            if (res) {
              if (this.data.currentAction === ACTION.ADD) {
                return { titleExist: true };
              } else if (res.id !== this.todoForm?.value?.id) {
                return { titleExist: true };
              }
            } else {
              return null;
            }
          })
        );
      }
      return null;
    };
  }
}
