import { Injectable } from '@angular/core';
import { TodosStore } from './todos.store';
import { createTodo, Todo, SearchObject, ACTION } from './todo.model';
import { TodosQuery } from './todos.query';
import { timer, Observable } from 'rxjs';
import { switchMap, map, distinctUntilChanged, debounceTime, delay } from 'rxjs/operators';
import { ValidationErrors, AbstractControl, AsyncValidatorFn, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Action } from 'rxjs/internal/scheduler/Action';
const URL = 'https://jsonplaceholder.typicode.com';
@Injectable({ providedIn: 'root' })
export class TodosService {
    constructor(
        private todosStore: TodosStore,
        private todosQuery: TodosQuery,
        private http: HttpClient
    ) { }



    // ------- FEATUER: ADD - EDIT - DELETE
    add(todo$: Todo): void {
        const todo: Todo = createTodo(todo$.title, todo$.content, todo$.creator, todo$.completed);
        this.todosStore.add(todo);
    }
    updateTodo(todo$: Todo): void {
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



    // ------- FORM VALIDATE
    validateTitle(getTypeFormAndcurrentTodo?: () => any): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            if (control.value) {
                return this.todosQuery.getTodoByTitle(control.value).pipe(
                    delay(500),
                    distinctUntilChanged(),
                    map((res: Todo) => {
                        const infoCurrent = getTypeFormAndcurrentTodo();
                        if (res) {
                            if (infoCurrent.typeForm === ACTION.ADD) {
                                console.log({ titleExist: true });
                                return { titleExist: true };
                            }
                            else if (res.id !== infoCurrent.currenttodo.id) {
                                console.log({ titleExist: true });
                                return { titleExist: true };
                            }
                        }
                        else {
                            return null;
                        }
                    })
                );
            }
        };
    }



    // ------- USING WITH API
    searchUser(text): Observable<any> {
        // debounce
        return this.http.get<any>(`${URL}/users?username=${text}`);
    }

    userValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            return this.searchUser(control.value)
                .pipe(
                    map((res: any) => {
                        // if username is already taken
                        if (res) {
                            // return error
                            return { titleExist: true };
                        }
                    })
                );
        };
    }
}
