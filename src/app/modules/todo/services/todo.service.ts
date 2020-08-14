import { Injectable } from '@angular/core';
import { TodoStore } from '../models/todo.store';
import { Todo, SearchObject } from '../models/todo.model';
import { TodoQuery } from '../models/todo.query';
import { guid } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private todoStore: TodoStore, private todoQuery: TodoQuery) {}

  public add(newTodo: Todo): void {
    const todo: Todo = this.createTodo(
      newTodo.title,
      newTodo.content,
      newTodo.creator,
      newTodo.deadLine
    );
    this.todoStore.add(todo);
  }

  public updateTodo(todo: Todo): void {
    this.todoStore.update(todo.id, todo);
  }

  public updateTodoComplete({ id, completed }: Todo): void {
    this.todoStore.update(id, { completed });
  }

  public delete(id: string): void {
    this.todoStore.remove(id);
  }

  public updateFilter(filter: SearchObject): void {
    this.todoStore.update({
      ui: {
        filter,
      },
    });
  }

  private createTodo(title: string, content: string, creator: string, deadLine: Date): Todo {
    return {
      id: guid(),
      title,
      content,
      creator,
      completed: false,
      createdDate: new Date(),
      deadLine : new Date(deadLine)
    } as Todo;
  }
}
