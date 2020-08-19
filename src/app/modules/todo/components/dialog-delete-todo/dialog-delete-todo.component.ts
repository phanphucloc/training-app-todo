import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
