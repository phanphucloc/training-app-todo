import { TodoQuery } from '../../models/todo.query';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, first } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit} from '@angular/core';
import { Todo} from '../../models/todo.model';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-form-add-todo',
  templateUrl: './form-add-todo.component.html',
})
export class FormAddTodoComponent implements OnInit {
  public todoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormAddTodoComponent>,
    private todoQuery: TodoQuery,
  ) {}

  public ngOnInit(): void {
    this.createFormAdd();
  }

  public createFormAdd(): void {
    this.todoForm = new FormGroup({
      title: new FormControl(
        '',
        [Validators.required, Validators.maxLength(40)],
        [this.validateTitle()]
      ),
      content: new FormControl(
        '',
        [Validators.required, Validators.maxLength(500)]
      ),
      creator: new FormControl(
        '',
        [Validators.required, Validators.maxLength(25)]
      ),
      deadLine: new FormControl(null),
    });
  }

  public submit(): void {
    let result = new Todo();
    result = this.todoForm.value;
    this.dialogRef.close(result);
  }

  public onDismiss(): void {
    this.dialogRef.close(null);
  }

  public limitDay(day: Date | null): boolean {
    const datepickerDay = day || new Date();
    const datepickerTime = datepickerDay.getTime();
    const currentDay = new Date().toDateString();
    const currentTime = new Date(currentDay).getTime();
    return datepickerTime >= currentTime;
  }

  private validateTitle(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (control.value) {
        return this.todoQuery.getTodoByTitle(control.value).pipe(
          first(),
          distinctUntilChanged(),
          map((res: Todo) => {
            if (res) {
              return { titleExist: true };
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
