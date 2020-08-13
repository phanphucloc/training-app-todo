export enum ACTION {
  EDIT = 'EDIT',
  ADD = 'ADD',
}
export enum RESULT_DIALOG {
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
  SUBMIT = 'DISAGREE',
  CANCEL = 'CANCEL'
}

export enum COMPLETED_FILTER {
  SHOW_COMPLETED = 'SHOW_COMPLETED',
  INCOMPLETE = 'SHOW_ACTIVE',
  SHOW_ALL = 'SHOW_ALL',
}

export const initCompletedFilters: CompletedFilter[] = [
  { label: 'All', value: COMPLETED_FILTER.SHOW_ALL },
  { label: 'Completed', value: COMPLETED_FILTER.SHOW_COMPLETED },
  { label: 'Incomplete', value: COMPLETED_FILTER.INCOMPLETE },
];

export class SearchObject {
  title: string;
  content: string;
  creator: string;
  completed: COMPLETED_FILTER;
}

export class CompletedFilter {
  label: string;
  value: COMPLETED_FILTER;
}

export class ResultFormTodo {
  todo: Todo;
  currentAction: string;
  resultDialog: string;
  constructor() {}
}

export class DataFormTodo {
  todo: Todo;
  currentAction: string;
}

export class Todo {
  id: string;
  title: string;
  content: string;
  creator: string;
  completed: boolean;
  constructor() {}
}

