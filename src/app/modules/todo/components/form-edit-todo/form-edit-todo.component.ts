import { TodoQuery } from '../../models/todo.query';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, first } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import { Todo} from '../../models/todo.model';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl} from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-form-edit-todo',
  templateUrl: './form-edit-todo.component.html',
})
export class FormEditTodoComponent implements OnInit {
  public todoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormEditTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public todo: Todo,
    private todoQuery: TodoQuery,
    private todoService: TodoService,
    private cdr: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.createFormEdit();
  }

  public createFormEdit(): void {
    this.todoForm = new FormGroup({
      id: new FormControl(
        this.todo?.id
      ),
      title: new FormControl(
        this.todo?.title,
        [Validators.required, Validators.maxLength(40)],
        [this.validateTitle()]
      ),
      content: new FormControl(
        this.todo?.content,
        [Validators.required, Validators.maxLength(500)]
      ),
      creator: new FormControl(
        this.todo?.creator,
        [Validators.required, Validators.maxLength(25)]
      ),
      deadLine: new FormControl(
        this.todo?.deadLine
      ),
      completed: new FormControl(
        this.todo?.completed
      ),
    });
    this.cdr.detectChanges();
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
        return this.todoService.getTodoByTitle(control.value).pipe(
          first(),
          distinctUntilChanged(),
          map((res: Todo) => {
            if (res && res.id !== this.todoForm?.value?.id) {
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
