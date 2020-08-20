import { Injectable } from '@angular/core';
import { TodoStore } from '../models/todo.store';
import { Todo, SearchObject } from '../models/todo.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(
    private todoStore: TodoStore,
    private firestore: AngularFirestore
  ) {}

  public getTodo(): Observable<Todo[]> {
    return this.firestore
      .collection('Todo')
      .snapshotChanges()
      .pipe(
        map((result) => {
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
        map((result) => {
          const listTodo: Todo[] = this.formatListTodo(result);
          const itemTodo = listTodo.shift();
          return itemTodo;
        })
      );
  }

  public add(newTodo: Todo): void {
    const todo: Todo = this.createTodo(
      newTodo.title,
      newTodo.content,
      newTodo.creator,
      newTodo.deadLine
    );
    this.firestore.collection('Todo').add(todo);
  }

  public updateTodo(todo: Todo): void {
    const todoId = todo.id;
    delete todo.id;
    this.firestore.collection('Todo').doc(todoId).update(todo);
  }

  public delete(id: string): void {
    this.firestore.collection('Todo').doc(id).delete();
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
