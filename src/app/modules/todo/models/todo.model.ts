export enum ACTION {
  EDIT = 'EDIT',
  ADD = 'ADD',
}

export enum ACTION_DIALOG {
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
  SUBMIT = 'DISAGREE',
  CANCEL = 'CANCEL',
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


export class Todo {
  id: string;
  title: string;
  content: string;
  creator: string;
  completed: boolean;
  createdDate: Date;
  deadLine: Date;
  constructor() {}
}
