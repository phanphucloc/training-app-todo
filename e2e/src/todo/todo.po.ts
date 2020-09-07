import {
  browser,
  by,
  element,
  promise,
  ElementFinder,
  ElementArrayFinder,
  By,
  Key,
  $,
} from 'protractor';

export class TodoPage {
  public navigateTo(): any {
    return browser.get('/todo/list');
  }

  public get pageTitleText(): ElementFinder {
    return element(by.tagName('body'));
  }

  public get tableTodo(): ElementFinder {
    return element(by.css('table'));
  }

  public get loadingTodo(): ElementFinder {
    return element(by.css('.loading-todo'));
  }

  public get listTodo(): ElementArrayFinder {
    return element.all(by.css('tbody tr'));
  }

  public get buttonAdd(): ElementFinder {
    return element(by.css('.btn-add-todo'));
  }

  public get buttonEdit(): ElementFinder {
    return element.all(By.css('mat-icon[title="Edit"]')).last();
  }

  public get buttonDelete(): ElementFinder {
    return element.all(By.css('mat-icon[title="Delete"]')).last();
  }

  public get modalTodo(): ElementFinder {
    return element(by.css('.modal-todo'));
  }

  public get dialogDelete(): ElementFinder {
    return element(by.css('.dialog-delete'));
  }

  public get formInputTitleTodo(): ElementFinder {
    return this.modalTodo.element(by.css('[formcontrolname="title"]'));
  }

  public get formInputCreatorTodo(): ElementFinder {
    return this.modalTodo.element(by.css('[formcontrolname="creator"]'));
  }

  public get formInputContentTodo(): ElementFinder {
    return this.modalTodo.element(by.css('[formcontrolname="content"]'));
  }

  public get formInputCompletedTodo(): ElementFinder {
    return this.modalTodo.element(by.css('[formcontrolname="completed"]'));
  }

  public get formErrorTitleTodo(): ElementFinder {
    return this.modalTodo.element(by.css('.error-title-todo'));
  }

  public get formErrorCreatorTodo(): ElementFinder {
    return this.modalTodo.element(by.css('.error-creator-todo'));
  }

  public get formErrorContentTodo(): ElementFinder {
    return this.modalTodo.element(by.css('.error-content-todo'));
  }

  public get buttonSubmit(): ElementFinder {
    return this.modalTodo.element(by.css('[type="submit"]'));
  }

  public get buttonSubmitDelete(): ElementFinder {
    return this.dialogDelete.element(by.css('.submit'));
  }

  public getFirstTodo(): ElementFinder {
    return this.listTodo.first();
  }

  public getLastTodo(): ElementFinder {
    return this.listTodo.last();
  }

  public getItemEditTodo(): ElementFinder {
    return this.getLastTodo();
  }

  public getItemDeleteTodo(): ElementFinder {
    return this.getLastTodo();
  }

  public getPageTitleText(): promise.Promise<string> {
    return element(by.css('.title-page')).getText();
  }

  public modalTodoIsPresent(): promise.Promise<boolean> {
    return this.modalTodo.isPresent();
  }

  public dialogDeleteIsPresent(): promise.Promise<boolean> {
    return this.dialogDelete.isPresent();
  }

  public formInputCompletedTodoIsChecked(): promise.Promise<boolean> {
    return this.formInputCompletedTodo
      .element(by.css('[type="checkbox"]'))
      .isSelected();
  }

  public getMockTodoAdd(): any {
    const todo: any = {
      title: 'test - ' + new Date().getTime(),
      content: 'test',
      creator: 'test',
    };
    return todo;
  }

  public getMockTodoEdit(): any {
    const todo: any = {
      title: 'test-edit ' + new Date().getTime(),
      content: 'test-edit',
      creator: 'test-edit',
      completed: true,
    };
    return todo;
  }

  public async getTitleOfLastTodo(): Promise<string> {
    const elementTitleOfLastTodo = this.getLastTodo().element(
      by.css('td:first-child')
    );
    const titleOfLastTodo = await elementTitleOfLastTodo
      .getText()
      .then(
        async (res): Promise<string> => {
          return res;
        }
      )
      .catch((err) => {
        return err;
      });
    return titleOfLastTodo;
  }

  public async addNewTodo(): Promise<any> {
    const newTodo: any = await this.getMockTodoAdd();

    await this.formInputTitleTodo.sendKeys(newTodo.title);
    await this.formInputContentTodo.sendKeys(newTodo.content);
    await this.formInputCreatorTodo.sendKeys(newTodo.creator);

    return Object.keys(newTodo).map((key) => newTodo[key]);
  }

  public async editTodo(): Promise<any> {
    const updateTodo: any = this.getMockTodoEdit();

    await this.formInputTitleTodo.clear();
    await this.formInputContentTodo.clear();
    await this.formInputCreatorTodo.clear();

    await this.formInputTitleTodo.sendKeys(updateTodo.title);
    await this.formInputContentTodo.sendKeys(updateTodo.content);
    await this.formInputCreatorTodo.sendKeys(updateTodo.creator);
    await this.checkCompletedTodo(updateTodo.completed);

    return Object.keys(updateTodo).map((key) => updateTodo[key]);
  }

  public async getTitleDeleteTodo(): Promise<string> {
    const titleTodoDelete = await this.getItemDeleteTodo()
      .element(by.css('td:first-child'))
      .getText()
      .then((result) => {
        return result;
      });

    return titleTodoDelete;
  }

  public async getToDoValueFromAddModal(): Promise<string[]> {
    const values = await Promise.all([
      this.formInputTitleTodo.getAttribute('value'),
      this.formInputContentTodo.getAttribute('value'),
      this.formInputCreatorTodo.getAttribute('value'),
    ]);
    return values;
  }

  public async getToDoValueFromEditModal(): Promise<(string | boolean)[]> {
    const values = await Promise.all([
      this.formInputTitleTodo.getAttribute('value'),
      this.formInputContentTodo.getAttribute('value'),
      this.formInputCreatorTodo.getAttribute('value'),
      this.formInputCompletedTodoIsChecked(),
    ]);
    return values;
  }

  public async getTextElement(elementFinder: ElementFinder): Promise<string> {
    const text = await elementFinder.getText().then(
      async (result): Promise<string> => {
        return result;
      }
    );
    return text;
  }

  public async checkCompletedTodo(value: boolean): Promise<boolean> {
    if (value) {
      return await this.formInputCompletedTodoIsChecked().then(
        async (result): Promise<boolean> => {
          if (!result) {
            await this.formInputCompletedTodo.click();
            return !result;
          }
          return result;
        }
      );
    } else {
      return await this.formInputCompletedTodoIsChecked().then(
        async (result): Promise<boolean> => {
          if (result) {
            await this.formInputCompletedTodo.click();
            return !result;
          }
          return result;
        }
      );
    }
  }
}
