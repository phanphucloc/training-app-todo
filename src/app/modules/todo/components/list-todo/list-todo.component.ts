import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Todo, ACTION, SearchObject } from '../../../../state-management/todo.model';
import { TodosService } from '../../../../state-management/todos.service';
import { TodosQuery } from '../../../../state-management/todos.query';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';



@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss']
})
export class ListTodoComponent implements OnInit {

  public currentAction: string = ACTION.ADD;
  public listTodo$: Observable<Todo[]>;
  public currentTodo: Todo;

  // value search
  public searchFrom: FormGroup;
  public searchObject: SearchObject;
  // --------

  constructor(
    private todoService: TodosService,
    private todosQuery: TodosQuery,
  ) {
    this.currentTodo = new Todo();
    this.searchObject = new SearchObject();
  }

  ngOnInit(): void {

    // Get data list todo
    this.listTodo$ = this.todosQuery.selectVisibleTodos$;
    // ---------

    // init search from
    this.searchFrom = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl(),
      creator: new FormControl(),
      completed: new FormControl()
    });
    // ---------

    // event search
    this.changeValueSearch();
    // -------

    // create value for fromGroup
    this.searchFrom.patchValue({
      title: '',
      content: '',
      creator: '',
      completed: null,
    });
    // ---------

  }


  // ------- FEATUER: ADD - EDIT - DELETE

  addTodo(): void {
    this.currentAction = ACTION.ADD;
    this.currentTodo = new Todo();
  }

  getInfoTodo(id$: string): void {
    this.currentAction = ACTION.EDIT;
    this.todosQuery.getTodoById(id$).subscribe((res) => {
      console.log(res);
      this.currentTodo = res;
    });
  }

  submit(): void {
    switch (this.currentAction) {
      case ACTION.ADD:
        this.todoService.add(this.currentTodo);
        this.currentTodo = new Todo();
        break;
      default:
        this.todoService.updateTodo(this.currentTodo);
        console.log('edit');
        break;
    }
  }

  deleteTodo(id: string): void {
    this.todoService.delete(this.currentTodo.id);
  }



  // ------- FEATUER: FILTER

  changeValueSearch(): void {
    combineLatest([
      this.searchFrom.controls.title.valueChanges,
      this.searchFrom.controls.content.valueChanges,
      this.searchFrom.controls.creator.valueChanges,
      this.searchFrom.controls.completed.valueChanges,
    ])
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe(([title, content, creator, completed]) => {
        console.log(title, content, creator, completed);
        const searchData = new SearchObject();
        searchData.title = title;
        searchData.content = content;
        searchData.creator = creator;
        searchData.completed = completed;
        console.log('filter:', searchData);
        this.todoService.updateFilter(searchData);
      });
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
