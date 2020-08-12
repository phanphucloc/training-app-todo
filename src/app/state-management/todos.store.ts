import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Todo, SearchObject } from './todo.model';

export interface TodosState extends EntityState<Todo, string> {
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
@StoreConfig({ name: 'todos' })
export class TodosStore extends EntityStore<TodosState> {
  constructor() {
    super(initialState);
  }
}
