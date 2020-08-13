import { Injectable } from '@angular/core';
import { TodoState, TodoStore } from './todo.store';
import { QueryEntity } from '@datorama/akita';
import { map, switchMap, take } from 'rxjs/operators';
import { Todo, SearchObject, COMPLETED_FILTER } from './todo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoQuery extends QueryEntity<TodoState> {
  constructor(protected store: TodoStore) {
    super(store);
  }

  public selectVisibilityFilter$(): Observable<SearchObject> {
    return this.select((state) => state.ui.filter);
  }

  public selectVisibleTodo(): Observable<Todo[]> {
    return this.selectVisibilityFilter$().pipe(
      switchMap((filter$: SearchObject) => {
        return this.selectAll().pipe(
          map((res) => this.getVisibleTodo(filter$, res))
        );
      })
    );
  }

  public getTodoById(todoId: string): Observable<Todo> {
    return this.selectAll({
      filterBy: ({ id }) => id === todoId,
    }).pipe(
      map((x) => x.shift()),
      take(1)
    );
  }

  public getTodoByTitle(todoTitle: string): Observable<Todo> {
    return this.selectAll({
      filterBy: ({ title }) => title === todoTitle,
    }).pipe(
      map((x) => x.shift()),
      take(1)
    );
  }

  private getVisibleTodo(filter: SearchObject, todo: Todo[]): Todo[] {
    if (filter.title != null && filter.title.trim() !== '') {
      todo = todo.filter((t) =>
        t.title.toLowerCase().includes(filter.title.toLowerCase())
      );
    }
    if (filter.content != null && filter.content.trim() !== '') {
      todo = todo.filter((t) =>
        t.content.toLowerCase().includes(filter.content.toLowerCase())
      );
    }
    if (filter.creator != null && filter.creator.trim() !== '') {
      todo = todo.filter((t) =>
        t.creator.toLowerCase().includes(filter.creator.toLowerCase())
      );
    }
    if (filter.completed !== null) {
      switch (filter.completed) {
        case COMPLETED_FILTER.SHOW_COMPLETED:
          todo = todo.filter((t) => t.completed);
          break;
        case COMPLETED_FILTER.INCOMPLETE:
          todo = todo.filter((t) => !t.completed);
          break;
        default:
          return todo;
      }
    }
    return todo;
  }
}
