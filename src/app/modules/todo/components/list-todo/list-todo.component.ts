import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Todo, ACTION, ResultFormTodo, RESULT_DIALOG } from '../../models/todo.model';
import { TodoQuery } from '../../models/todo.query';
import { FormAddAndEditTodoComponent } from '../form-add-and-edit-todo/form-add-and-edit-todo.component';
import { DialogDeleteTodoComponent } from '../dialog-delete-todo/dialog-delete-todo.component';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
})
export class ListTodoComponent implements OnInit {
  @Input() listTodo: Todo[];

  @Output() changeCompletedStatusEvent = new EventEmitter<Todo>();
  @Output() deleteTodoEvent = new EventEmitter<string>();
  @Output() updateTodoEvent = new EventEmitter<Todo>();

  public displayedColumns: string[] = [
    'title',
    'content',
    'creator',
    'completed',
    'action',
  ];

  constructor(
    public dialog: MatDialog,
    private todoQuery: TodoQuery,
  ) { }

  ngOnInit(): void {
  }

  public updateCompletedStatus(value: boolean, todo: Todo): void {
    this.changeCompletedStatusEvent.emit({ ...todo, completed: value });
  }

  public deleteTodo(id: string): void {
    const dialogDeleteRef = this.dialog.open(DialogDeleteTodoComponent, {
      width: '450px',
    });
    dialogDeleteRef.afterClosed().subscribe((result: string) => {
      if (result === RESULT_DIALOG.AGREE) {
        this.deleteTodoEvent.emit(id);
      }
    });
  }

  public updateTodo(id: string): void {
    this.todoQuery.getTodoById(id).subscribe((res: Todo) => {
      const todoItem = new Todo();
      todoItem.id = res.id;
      todoItem.title = res.title;
      todoItem.content = res.content;
      todoItem.creator = res.creator;
      todoItem.completed = res.completed;
      this.openDialogUpdateTodo(todoItem);
    });
  }

  public openDialogUpdateTodo(todoItem?: Todo): void {
    const dialogEditTodoRef = this.dialog.open(FormAddAndEditTodoComponent, {
      width: '450px',
      data: { currentAction: ACTION.EDIT, todo: todoItem },
    });

    dialogEditTodoRef.afterClosed().subscribe((result: ResultFormTodo) => {
      if (result.resultDialog === RESULT_DIALOG.SUBMIT){
        this.updateTodoEvent.emit(result.todo);
      }
    });
  }

  public trackByFn(index: number, item: any): number {
    return item.id;
  }
}
