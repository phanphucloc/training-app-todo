import { Injectable } from '@angular/core';
import { TodoStore } from '../models/todo.store';
import { Todo, SearchObject } from '../models/todo.model';
import { guid } from '@datorama/akita';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(
    private todoStore: TodoStore,
    private firestore: AngularFirestore
  ) {}

  public getTodo(): void {
    this.firestore
      .collection('Todo')
      .snapshotChanges(['added', 'removed'])
      .pipe(
        map((result) => {
          const listTodo: Todo[] = result.map((item) => {
            const rawItem: any = item.payload.doc.data();
            const itemTodo: Todo = new Todo();
            itemTodo.id = rawItem.id;
            itemTodo.title = rawItem.title;
            itemTodo.creator = rawItem.creator;
            itemTodo.content = rawItem.content;
            itemTodo.completed = rawItem.completed;
            itemTodo.completed = null;
            itemTodo.createdDate = null;
            if (!rawItem.createdDate || !rawItem.createdDate.seconds) {
              itemTodo.createdDate = new Date(
                Number(rawItem.createdDate.seconds || 0) * 1000
              );
            }
            if (!rawItem.deadLine || !rawItem.deadLine.seconds) {
              itemTodo.createdDate = new Date(
                Number(rawItem.createdDate.seconds || 0) * 1000
              );
            }
            return itemTodo;
          });
          return listTodo;
        })
      )
      .subscribe((res: Todo[]) => {
        this.todoStore.set(res);
      });

    this.firestore
      .collection('Todo')
      .valueChanges()
      .pipe(
        map((result) => {
          return result;
        })
      )
      .subscribe((res: Todo[]) => {
        console.log(res);
      });
    this.firestore
      .collection('Todo')
      .stateChanges(['added'])
      .pipe(
        map((result) => {
          return result;
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  public add(newTodo: Todo): void {
    const todo: Todo = this.createTodo(
      newTodo.title,
      newTodo.content,
      newTodo.creator,
      newTodo.deadLine
    );
    // this.todoStore.add(todo);
    this.firestore
      .collection('Todo')
      .add(todo)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public updateTodo(todo: Todo): void {
    this.todoStore.update(todo.id, todo);
  }

  public updateTodoComplete({ id, completed }: Todo): void {
    this.todoStore.update(id, { completed });
  }

  public delete(id: string): void {
    this.todoStore.remove(id);
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
      id: guid(),
      title,
      content,
      creator,
      completed: false,
      createdDate: new Date(),
      deadLine: new Date(deadLine),
    } as Todo;
  }
}
