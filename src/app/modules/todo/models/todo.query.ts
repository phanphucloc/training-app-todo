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

  public selectVisibilityFilter(): Observable<SearchObject> {
    return this.select((state) => state.ui.filter);
  }

  public selectVisibleTodo(): Observable<Todo[]> {
    return this.selectVisibilityFilter().pipe(
      switchMap((filter: SearchObject) => {
        return this.selectAll().pipe(
          map((res) => this.getVisibleTodo(filter, res))
        );
      })
    );
  }

  public getTodoById(todoId: string): Observable<Todo> {
    return this.selectEntity(({ id }) => id === todoId);
  }

  public getTodoByTitle(todoTitle: string): Observable<Todo> {
    return this.selectEntity(({ title }) => title === todoTitle);
  }

  private getVisibleTodo(filter: SearchObject, listTodo: Todo[]): Todo[] {
    if (filter?.title?.trim() !== '') {
      listTodo = listTodo.filter((todo) =>
        todo.title.toLowerCase().includes(filter.title.toLowerCase())
      );
    }
    if (filter?.content?.trim() !== '') {
      listTodo = listTodo.filter((todo) =>
        todo.content.toLowerCase().includes(filter.content.toLowerCase())
      );
    }
    if (filter?.creator?.trim() !== '') {
      listTodo = listTodo.filter((todo) =>
        todo.creator.toLowerCase().includes(filter.creator.toLowerCase())
      );
    }
    if (filter?.completed !== null) {
      switch (filter.completed) {
        case COMPLETED_FILTER.SHOW_COMPLETED:
          listTodo = listTodo.filter((t) => t.completed);
          break;
        case COMPLETED_FILTER.INCOMPLETE:
          listTodo = listTodo.filter((t) => !t.completed);
          break;
        default:
          return listTodo;
      }
    }
    return listTodo;
  }
}
