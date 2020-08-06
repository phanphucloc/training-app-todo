import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Todo, ACTION, SearchObject, initCompletedFilters, DataFormTodo, ACTIONMODAL } from '../../../../state-management/todo.model';
import { TodosService } from '../../../../state-management/todos.service';
import { TodosQuery } from '../../../../state-management/todos.query';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormTodoComponent } from '../form-todo/form-todo.component';


@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss']
})
export class ListTodoComponent implements OnInit {
  public displayedColumns: string[] = ['title', 'content', 'creator', 'completed', 'action'];
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
  public completedFilters = initCompletedFilters;
  // --------

  constructor(
    private todoService: TodosService,
    private todosQuery: TodosQuery,
    private translateService: TranslateService,
    public dialog: MatDialog
  ) {
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

    // Init search form
    this.searchForm = new FormGroup({
      title: new FormControl(),
      content: new FormControl(),
      creator: new FormControl(),
      completed: new FormControl()
    });
    // ---------

    // Init todo form
    this.todoForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(20)],
        [this.todoService.validateTitle(this.getInfoCurrent.bind(this))]),
      content: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      creator: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
    // ---------

  }





  // ------- FEATUER: ADD - EDIT - DELETE

  addTodo(): void {
    this.currentAction = ACTION.ADD;
    this.openDialogTodo();
  }

  getInfoTodo(id$: string): void {
    this.currentAction = ACTION.EDIT;
    this.resetFormTodo(this.currentAction);
    this.todosQuery.getTodoById(id$).subscribe((res: Todo) => {
      this.todoForm.setValue({
        id: res.id,
        title: res.title,
        content: res.content,
        creator: res.creator,
        completed: res.completed
      });
      this.openDialogTodo();
    });
  }

  openDialogTodo(): void {
    const dialogRef = this.dialog.open(FormTodoComponent, {
      width: '550px',
      data: { currentAction: this.currentAction, todoForm: this.todoForm }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      console.log('The dialog was closed', result);
      console.log(this.todoForm.value);
      if (result === ACTIONMODAL.SUBMIT) {
        this.submit();
      }
      else {
        this.resetFormTodo(this.currentAction);
      }
    });
  }

  submit(): void {
    switch (this.currentAction) {
      case ACTION.ADD:
        this.todoService.add(this.todoForm.value);
        this.resetFormTodo(this.currentAction);
        break;
      default:
        this.currentAction = ACTION.ADD;
        this.todoService.updateTodo(this.todoForm.value);
        this.resetFormTodo(this.currentAction);
        break;
    }
  }

  resetFormTodo(typeAction: string): void {
    this.todoForm.reset();
    switch (typeAction) {
      case ACTION.ADD:
        this.todoForm.removeControl('id');
        this.todoForm.removeControl('completed');
        break;
      default:
        this.todoForm.addControl('id', new FormControl(''));
        this.todoForm.addControl('completed', new FormControl(false));
        break;
    }
  }

  deleteTodo(id: string): void {
    this.todoService.delete(id);
  }





  // ------- FEATUER: FILTER

  changeValueSearch(): void {

    // Combine
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
        const searchData = new SearchObject();
        searchData.title = title;
        searchData.content = content;
        searchData.creator = creator;
        searchData.completed = completed;
        this.todoService.updateFilter(searchData);
      });
    // ---------

    // Create value for formGroup
    this.searchForm.patchValue({
      title: '',
      content: '',
      creator: '',
      completed: null,
    });
    // ---------
  }

  getInfoCurrent(): any {
    return {
      currentAction: this.currentAction,
      currenttodo: this.todoForm?.value
    };
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
