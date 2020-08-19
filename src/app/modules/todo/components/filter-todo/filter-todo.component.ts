import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { combineLatest, ReplaySubject } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  SearchObject,
  initCompletedFilters,
  COMPLETED_FILTER,
} from '../../models/todo.model';

@Component({
  selector: 'app-filter-todo',
  templateUrl: './filter-todo.component.html',
})
export class FilterTodoComponent implements OnInit {
  @Output() changeFilterValue = new EventEmitter<SearchObject>();

  public searchForm: FormGroup;
  public searchObject: SearchObject;
  public completedFilters = initCompletedFilters;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {}

  ngOnInit(): void {
    this.createForm();
    this.changeValueSearch();
  }

  public createForm(): void {
    this.searchForm = new FormGroup({
      title: new FormControl(''),
      content: new FormControl(''),
      creator: new FormControl(''),
      completed: new FormControl(COMPLETED_FILTER.SHOW_ALL),
    });
  }

  public changeValueSearch(): void {
    combineLatest([
      this.searchForm.controls.title.valueChanges.pipe(startWith('')),
      this.searchForm.controls.content.valueChanges.pipe(startWith('')),
      this.searchForm.controls.creator.valueChanges.pipe(startWith('')),
      this.searchForm.controls.completed.valueChanges.pipe(
        startWith(COMPLETED_FILTER.SHOW_ALL)
      ),
    ])
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(([title, content, creator, completed]) => {
        const searchData = new SearchObject();
        searchData.title = title;
        searchData.content = content;
        searchData.creator = creator;
        searchData.completed = completed;
        this.changeFilterValue.emit(searchData);
      });
  }
}
