import { Injectable } from '@angular/core';
import { TodoStore } from '../models/todo.store';
import { Todo, SearchObject } from '../models/todo.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';
import { StatusRequest } from 'src/app/common/models/auth.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(
    private todoStore: TodoStore,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  public getTodo(): Observable<Todo[]> {
    return this.firestore
      .collection('Todo', (ref) => ref.where('idUser', '==', this.authService.userFromLocalStorage.uid))
      .snapshotChanges()
      .pipe(
        switchMap((result) => {
          return this.authService.checkAuthAPI(result);
        }),
        map((result: any[]) => {
          console.log(result);
          const listTodo: Todo[] = this.formatListTodo(result);
          this.todoStore.set(listTodo);
          return listTodo;
        })
      );
  }

  public getTodoByTitle(todoTitle: string): Observable<any> {
    return this.firestore
      .collection('Todo', (ref) => ref.where('title', '==', todoTitle))
      .snapshotChanges()
      .pipe(
        switchMap((result) => {
          return this.authService.checkAuthAPI(result);
        }),
        map((result: any[]) => {
          const listTodo: Todo[] = this.formatListTodo(result);
          const itemTodo = listTodo.shift();
          return itemTodo;
        })
      );
  }

  public async add(newTodo: Todo): Promise<StatusRequest> {
    const checkResult = this.authService.checkExpirationToken();
    if (checkResult.status) {
      const todo: Todo = this.createTodo(
        newTodo.title,
        newTodo.content,
        newTodo.creator,
        newTodo.deadLine
      );
      await this.firestore.collection('Todo').add(todo);
    }
    return checkResult;
  }

  public async updateTodo(todo: Todo): Promise<StatusRequest> {
    const checkResult = this.authService.checkExpirationToken();
    if (checkResult.status) {
      const todoId = todo.id;
      delete todo.id;
      await this.firestore.collection('Todo').doc(todoId).update(todo);
    }
    return checkResult;
  }

  public async delete(id: string): Promise<StatusRequest> {
    const checkResult = this.authService.checkExpirationToken();
    if (checkResult.status){
      await this.firestore.collection('Todo').doc(id).delete();
    }
    return checkResult;
  }

  public updateFilter(filter: SearchObject): void {
    this.todoStore.update({
      ui: {
        filter,
      },
    });
  }

  private createTodo(
    title: string,
    content: string,
    creator: string,
    deadLine: Date
  ): Todo {
    return {
      title,
      content,
      idUser : this.authService.userFromLocalStorage.uid,
      creator,
      completed: false,
      createdDate: new Date(),
      deadLine: new Date(deadLine),
    } as Todo;
  }

  private formatListTodo(listTodoRaw: any[]): Todo[] {
    const listTodo: Todo[] = listTodoRaw.map((item) => {
      const rawItem: any = item.payload.doc.data();
      const itemTodo: Todo = this.formatItemTodo(item.payload.doc.id, rawItem);
      return itemTodo;
    });
    return listTodo;
  }

  private formatItemTodo(idTodo: string, todoRaw: any): Todo {
    const itemTodo: Todo = new Todo();
    itemTodo.id = idTodo;
    itemTodo.title = todoRaw.title;
    itemTodo.creator = todoRaw.creator;
    itemTodo.content = todoRaw.content;
    itemTodo.completed = todoRaw.completed;
    if (todoRaw?.createdDate && todoRaw?.createdDate.seconds) {
      itemTodo.createdDate = new Date(
        Number(todoRaw.createdDate.seconds || 0) * 1000
      );
    }
    if (todoRaw?.deadLine && todoRaw?.deadLine.seconds) {
      itemTodo.deadLine = new Date(
        Number(todoRaw.deadLine.seconds || 0) * 1000
      );
    }
    return itemTodo;
  }
}
