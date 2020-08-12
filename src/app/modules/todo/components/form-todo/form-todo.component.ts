import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataFormTodo, ACTIONMODAL } from 'src/app/state-management/todo.model';

@Component({
  selector: 'app-form-todo',
  templateUrl: './form-todo.component.html',
  styleUrls: ['./form-todo.component.scss']
})
export class FormTodoComponent implements OnInit {
  public todoForm: FormGroup;
  public currentAction: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FormTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataFormTodo
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.dialogRef.close(ACTIONMODAL.SUBMIT);
  }

  cancel(): void {
    this.dialogRef.close(ACTIONMODAL.CANCEL);
  }
}
