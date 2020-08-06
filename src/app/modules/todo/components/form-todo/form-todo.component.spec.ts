import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTodoComponent } from './form-todo.component';

describe('FormTodoComponent', () => {
  let component: FormTodoComponent;
  let fixture: ComponentFixture<FormTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
