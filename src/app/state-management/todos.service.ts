import { Injectable } from '@angular/core';
import { TodosStore } from './todos.store';
import { createTodo, Todo, SearchObject, ACTION } from './todo.model';
import { TodosQuery } from './todos.query';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged, delay } from 'rxjs/operators';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class TodosService {
  constructor(private todosStore: TodosStore, private todosQuery: TodosQuery) {}

  add(todo$: Todo): void {
    const todo: Todo = createTodo(todo$.title, todo$.content, todo$.creator);
    this.todosStore.add(todo);
  }

  updateTodo(todo$: Todo): void {
    this.todosStore.update(todo$.id, todo$);
  }

  updateTodoComplete({ id, completed }: Todo): void {
    this.todosStore.update(id, { completed });
  }

  delete(id: string): void {
    this.todosStore.remove(id);
  }

  updateFilter(filter: SearchObject): void {
    this.todosStore.update({
      ui: {
        filter,
      },
    });
  }

  validateTitle(getTypeFormAndcurrentTodo?: () => any): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      if (control.value) {
        return this.todosQuery.getTodoByTitle(control.value).pipe(
          delay(100),
          distinctUntilChanged(),
          map((res: Todo) => {
            const infoCurrent = getTypeFormAndcurrentTodo();

            if (res) {
              if (infoCurrent.typeForm === ACTION.ADD) {
                return { titleExist: true };
              } else if (res.id !== infoCurrent.currenttodo.id) {
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
