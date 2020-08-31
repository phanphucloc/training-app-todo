import { Injectable } from '@angular/core';
import { TodoStore } from '../models/todo.store';
import { Todo, SearchObject, createTodo } from '../models/todo.model';
import { AngularFirestore, DocumentReference, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(
    private todoStore: TodoStore,
    private fireStore: AngularFirestore,
    private authService: AuthService
  ) {}

  public getTodo(): Observable<Todo[]> {
    return this.fireStore
      .collection('Todo', (ref) =>
        ref.where('idUser', '==', this.authService.user.uid)
      )
      .snapshotChanges()
      .pipe(
        map((result: any[]) => {
          const listTodo = this.formatListTodo(result);
          this.todoStore.set(listTodo);
          return listTodo;
        })
      );
  }

  public getTodoByTitle(todoTitle: string): Observable<any> {
    return this.fireStore
      .collection('Todo', (ref) => ref.where('title', '==', todoTitle))
      .snapshotChanges()
      .pipe(
        map((result: DocumentChangeAction<unknown>[]) => {
          const listTodo = this.formatListTodo(result);
          const itemTodo = listTodo.shift();
          return itemTodo;
        })
      );
  }

  public add(newTodo: Todo): Observable<DocumentReference> {
    const todo: Todo = createTodo(
      newTodo.title,
      newTodo.content,
      newTodo.creator,
      newTodo.deadLine
    );
    return from(this.fireStore.collection('Todo').add(todo));
  }

  public updateTodo(todo: Todo): Observable<void> {
    const todoId = todo.id;
    delete todo.id;
    return from(this.fireStore.collection('Todo').doc(todoId).update(todo));
  }

  public delete(id: string): Observable<void> {
    return from(this.fireStore.collection('Todo').doc(id).delete());
  }

  public updateFilter(filter: SearchObject): void {
    this.todoStore.update({
      ui: {
        filter,
      },
    });
  }

  private formatListTodo(listTodoRaw: DocumentChangeAction<unknown>[]): Todo[] {
    const listTodo = listTodoRaw.map((item) => {
      const rawItem = item.payload.doc.data();
      const itemTodo = this.formatItemTodo(item.payload.doc.id, rawItem);
      return itemTodo;
    });
    return listTodo;
  }

  private formatItemTodo(idTodo: string, todoRaw: any): Todo {
    const itemTodo = new Todo();
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
