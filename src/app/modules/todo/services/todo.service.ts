import { Injectable } from '@angular/core';
import { TodoStore } from '../models/todo.store';
import { Todo, SearchObject, ACTION } from '../models/todo.model';
import { TodoQuery } from '../models/todo.query';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged, delay } from 'rxjs/operators';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { guid } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private todoStore: TodoStore, private todoQuery: TodoQuery) {}

  public add(todo$: Todo): void {
    const todo: Todo = this.createTodo(todo$.title, todo$.content, todo$.creator);
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

  public validateTitle(getTypeFormAndCurrentTodo?: () => any): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      if (control.value) {
        return this.todoQuery.getTodoByTitle(control.value).pipe(
          delay(100),
          distinctUntilChanged(),
          map((res: Todo) => {
            const infoCurrent = getTypeFormAndCurrentTodo();

            if (res) {
              if (infoCurrent.typeForm === ACTION.ADD) {
                return { titleExist: true };
              } else if (res.id !== infoCurrent.currentTodo.id) {
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

  private createTodo(title: string, content: string, creator: string): Todo {
    return {
      id: guid(),
      title,
      content,
      creator,
      completed: false,
    } as Todo;
  }
}
