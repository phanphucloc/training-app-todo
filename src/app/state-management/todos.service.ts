import { Injectable } from '@angular/core';
import { TodosStore } from './todos.store';
import { createTodo, Todo, SearchObject } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodosService {
    constructor(private todosStore: TodosStore) { }

    // ------- FEATUER: ADD - EDIT - DELETE
    add(todo$: Todo): void {
        const todo: Todo = createTodo(todo$.title, todo$.content, todo$.creator, todo$.completed);
        this.todosStore.add(todo);
    }
    updateTodo(todo$: Todo): void{
        this.todosStore.update(todo$.id, todo$);
    }
    delete(id: string): void {
        this.todosStore.remove(id);
    }

    // ------- FEATUER: FILTER
    updateFilter(filter: SearchObject): void {
        this.todosStore.update({
            ui: {
                filter
            }
        });
    }
}
