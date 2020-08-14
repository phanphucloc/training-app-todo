import {
  Component,
  OnInit,
  Inject,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import {
  DataFormTodo,
  ACTION,
  Todo,
  ACTION_DIALOG,
  ResultFormTodo,
} from '../../models/todo.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { TodoQuery } from '../../models/todo.query';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-form-add-and-edit-todo',
  templateUrl: './form-add-and-edit-todo.component.html',
})
export class FormAddAndEditTodoComponent
  implements OnInit, AfterContentChecked {
  public todoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormAddAndEditTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataFormTodo,
    private todoQuery: TodoQuery,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    switch (this.data.currentAction) {
      case ACTION.ADD:
        this.createFormAdd();
        break;
      default:
        this.createFormEdit();
        break;
    }
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
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
      id: new FormControl(this.data.todo?.id, [
        Validators.required,
        Validators.maxLength(500),
      ]),
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
  }

  public submit(): void {
    const result = new ResultFormTodo();
    result.currentAction = this.data.currentAction;
    result.actionDialog = ACTION_DIALOG.SUBMIT;
    result.todo = this.todoForm.value;
    this.dialogRef.close(result);
  }

  public cancel(): void {
    const result = new ResultFormTodo();
    result.currentAction = this.data.currentAction;
    result.actionDialog = ACTION_DIALOG.CANCEL;
    result.todo = null;
    this.dialogRef.close(result);
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
