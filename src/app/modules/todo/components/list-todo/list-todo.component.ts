import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
})
export class ListTodoComponent implements OnInit {
  @Input() listTodo: Todo[];

  @Output() changeCompletedStatusEvent = new EventEmitter<Todo>();
  @Output() updateTodoEvent = new EventEmitter<string>();
  @Output() deleteTodoEvent = new EventEmitter<string>();

  public displayedColumns: string[] = [
    'title',
    'content',
    'creator',
    'createdDate',
    'deadline',
    'completed',
    'action',
  ];

  constructor(public dialog: MatDialog) {}

  public ngOnInit(): void {}

  public updateCompletedStatus(value: boolean, todo: Todo): void {
    this.changeCompletedStatusEvent.emit({
      ...todo,
      completed: value,
    });
  }

  public deleteTodo(id: string): void {
    this.deleteTodoEvent.emit(id);
  }

  public updateTodo(id: string): void {
    this.updateTodoEvent.emit(id);
  }
}
