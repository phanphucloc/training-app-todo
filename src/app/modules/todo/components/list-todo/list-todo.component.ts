import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Todo, ACTION, SearchObject } from '../../../../state-management/todo.model';
import { TodosService } from '../../../../state-management/todos.service';
import { TodosQuery } from '../../../../state-management/todos.query';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';



@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss']
})
export class ListTodoComponent implements OnInit {

  public listTodo$: Observable<Todo[]>;
  public currentLang = this.translateService.currentLang;

  // Add  - Edit
  public todoForm: FormGroup;
  public currentTodo: Todo;
  public currentAction: string = ACTION.ADD;
  // --------

  // Value search
  public searchForm: FormGroup;
  public searchObject: SearchObject;
  // --------

  constructor(
    private todoService: TodosService,
    private todosQuery: TodosQuery,
    private translateService: TranslateService
  ) {
    this.currentTodo = new Todo();
    this.searchObject = new SearchObject();
  }

  ngOnInit(): void {

    // Get data
    this.getData();
    // -------

    // Create form data( add / edit todo)
    this.createForm();
    // -------

    // event search
    this.changeValueSearch();
    // -------

    // create value for fromGroup
    this.searchForm.patchValue({
      title: '',
      content: '',
      creator: '',
      completed: null,
    });
    // ---------

  }





  // ------- SETUP DATA

  getData(): void {
    // Get name language using
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
    });
    // ---------

    // Get data list todo
    this.listTodo$ = this.todosQuery.selectVisibleTodos$;
    // ---------
  }

  createForm(): void {

    // init search from
    this.searchForm = new FormGroup({
      title: new FormControl(),
      content: new FormControl(),
      creator: new FormControl(),
      completed: new FormControl()
    });
    // ---------

    // init todo from
    this.todoForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required, Validators.maxLength(20)],
        [this.todoService.validateTitle(this.getInfo.bind(this))]),
      content: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      creator: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      completed: new FormControl(false)
    });
    // ---------
  }



  getInfo(): any {
    return {
      currentAction: this.currentAction,
      currenttodo: this.todoForm?.value
    };
  }

  // ------- FEATUER: ADD - EDIT - DELETE

  addTodo(): void {
    this.currentAction = ACTION.ADD;
    this.resetForm();
  }

  getInfoTodo(id$: string): void {
    this.currentAction = ACTION.EDIT;
    this.todosQuery.getTodoById(id$).subscribe((res: Todo) => {
      console.log(res);
      this.currentTodo = res;
      this.todoForm.setValue({
        id: res.id,
        title: res.title,
        content: res.content,
        creator: res.creator,
        completed: res.completed
      });
    });
  }

  submit(): void {
    console.log(this.todoForm.value);
    switch (this.currentAction) {
      case ACTION.ADD:
        this.todoService.add(this.todoForm.value);
        this.resetForm();
        break;
      default:
        this.currentAction = ACTION.ADD;
        this.todoService.updateTodo(this.todoForm.value);
        this.resetForm();
        console.log('edit');
        break;
    }
  }

  resetForm(): void {
    this.todoForm.reset();
    this.todoForm.patchValue({ completed: false });
  }

  deleteTodo(id: string): void {
    this.todoService.delete(this.currentTodo.id);
  }





  // ------- FEATUER: FILTER

  changeValueSearch(): void {
    combineLatest([
      this.searchForm.controls.title.valueChanges,
      this.searchForm.controls.content.valueChanges,
      this.searchForm.controls.creator.valueChanges,
      this.searchForm.controls.completed.valueChanges,
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
