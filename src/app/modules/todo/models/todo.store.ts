import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Todo, SearchObject } from './todo.model';

export interface TodoState extends EntityState<Todo, string> {
  ui: {
    filter: SearchObject;
  };
}

const initialState = {
  ui: { filter: new SearchObject() },
};

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'todo' })
export class TodoStore extends EntityStore<TodoState> {
  constructor() {
    super(initialState);
  }
}
