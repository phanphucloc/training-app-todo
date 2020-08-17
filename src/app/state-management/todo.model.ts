import { guid } from '@datorama/akita';
import { FormGroup } from '@angular/forms';

// ----------------ACTION
export enum ACTION {
  EDIT = 'EDIT',
  ADD = 'ADD',
}
export enum ACTIONMODAL {
  CANCEL = 'EDIT',
  SUBMIT = 'ADD',
}
export enum ACTIONCOMFIRM {
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
}

// ---------------- FILTER
export class SearchObject{
  title: string;
  content: string;
  creator: string;
  completed: COMPLETED_FILTER;
}

export enum COMPLETED_FILTER {
  SHOW_COMPLETED = 'SHOW_COMPLETED',
  INCOMPLETED = 'SHOW_ACTIVE',
  SHOW_ALL = 'SHOW_ALL'
}

export class CompletedFilter {
  label: string;
  value: COMPLETED_FILTER;
}

export const initCompletedFilters: CompletedFilter[] = [
  { label: 'All', value: COMPLETED_FILTER.SHOW_ALL },
  { label: 'Completed', value: COMPLETED_FILTER.SHOW_COMPLETED },
  { label: 'Incompleted', value: COMPLETED_FILTER.INCOMPLETED }
];

// ---------------- TODO
export class Todo {
  id: string;
  title: string;
  content: string;
  creator: string;
  completed: boolean;
  constructor(){
  }
}
export class DataFormTodo {
  todoForm: FormGroup;
  currentAction: string;
}

export function createTodo(title: string, content: string, creator: string): Todo {
  return {
    id: guid(),
    title,
    content,
    creator,
    completed: false
  } as Todo;
}
