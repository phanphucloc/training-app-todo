import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ACTION_DIALOG } from '../../models/todo.model';

@Component({
  selector: 'app-dialog-delete-todo',
  templateUrl: './dialog-delete-todo.component.html',
})
export class DialogDeleteTodoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  agree(): void {
    this.dialogRef.close(ACTION_DIALOG.AGREE);
  }

  cancel(): void {
    this.dialogRef.close(ACTION_DIALOG.DISAGREE);
  }
}
