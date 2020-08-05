import { guid } from '@datorama/akita';



// ----------------ACTION
export enum ACTION {
  EDIT = 'EDIT',
  ADD = 'ADD',
}


// ---------------- FILTER
export class SearchObject{
  title: string;
  content: string;
  creator: string;
  completed: boolean;
}



// ---------------- TODO
export class Todo {
  id: string;
  title: string;
  content: string;
  creator: string;
  completed: boolean;
  constructor(){
    this.completed = true;
  }
}

export function createTodo(title: string, content: string, creator: string, completed: boolean): Todo {
  return {
    id: guid(),
    title,
    content,
    creator,
    completed
  } as Todo;
}
