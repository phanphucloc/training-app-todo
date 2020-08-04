import { Injectable } from '@angular/core';
import { TodosState, TodosStore } from './todos.store';
import { QueryEntity } from '@datorama/akita';
import { map, switchMap } from 'rxjs/operators';
import { Todo, SearchObject } from './todo.model';

@Injectable({
    providedIn: 'root'
})
export class TodosQuery extends QueryEntity<TodosState> {
    selectVisibilityFilter$ = this.select(state => state.ui.filter);


    selectVisibleTodos$ = this.selectVisibilityFilter$.pipe(
        switchMap((filter$: SearchObject) => {
            return this.selectAll().pipe(
                map((res) => this.getVisibleTodos(filter$, res))
            );
        })
    );


    getTodoById = (id$: string) => {
        return this.selectAll({
            filterBy: ({ id }) => id === id$
        }).pipe(
            map(x => x.shift()),
        );
    }

    constructor(protected store: TodosStore) {
        super(store);
    }

    private getVisibleTodos(filter$: SearchObject, todos: Todo[]): Todo[] {
        console.log('filter:', filter$);
        // ------ Search title
        if (filter$.title != null && filter$.title.trim() !== '') {
            todos = todos.filter(t => t.title.toLowerCase().includes(filter$.title));
        }
        // ------ Search content
        if (filter$.content != null && filter$.content.trim() !== '') {
            todos = todos.filter(t => t.content.toLowerCase().includes(filter$.content));
        }
        // ------ Search creator
        if (filter$.creator != null && filter$.creator.trim() !== '') {
            todos = todos.filter(t => t.creator.toLowerCase().includes(filter$.creator));
        }
        // ------ Search completed
        if (filter$.completed !== null) {
            todos = todos.filter(t => t.completed === filter$.completed);
        }
        return todos;
    }
}
