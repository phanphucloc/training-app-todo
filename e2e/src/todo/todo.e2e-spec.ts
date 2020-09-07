import { TodoPage } from './todo.po';
import { LoginPage } from '../login/login.po';
import { protractor } from 'protractor/built/ptor';
import { browser, Key, by, element } from 'protractor';
import { abort } from 'process';

describe('protractor-test - Todo page', () => {
  let loginPage: LoginPage;
  let todoPage: TodoPage;

  const EC = protractor.ExpectedConditions;

  beforeEach( async () => {
    loginPage = new LoginPage();
    todoPage = new TodoPage();
    await todoPage.navigateTo();
  });

  it('The add todo button works', async (done) => {
    const buttonAddTodo = todoPage.buttonAdd;
    await buttonAddTodo.click();
    expect(await todoPage.modalTodoIsPresent()).toBe(true);

    done();
  });

  it('Validate Form Add', async (done) => {
    const buttonAdd = todoPage.buttonAdd;
    const formInputTitleTodo = todoPage.formInputTitleTodo;
    const formInputCreatorTodo = todoPage.formInputCreatorTodo;
    const formInputContentTodo = todoPage.formInputContentTodo;

    await buttonAdd.click();

    await formInputTitleTodo.sendKeys('');
    await formInputTitleTodo.sendKeys(Key.TAB);
    await browser.wait(EC.visibilityOf(todoPage.formErrorTitleTodo));
    expect(await todoPage.formErrorTitleTodo.getText()).toEqual(`Title is required`);

    await formInputCreatorTodo.sendKeys('');
    await formInputCreatorTodo.sendKeys(Key.TAB);
    await browser.wait(EC.visibilityOf(todoPage.formErrorCreatorTodo));
    expect(await todoPage.formErrorCreatorTodo.getText()).toEqual(
      `Creator is required`
    );

    await formInputContentTodo.sendKeys('');
    await formInputContentTodo.sendKeys(Key.TAB);
    await browser.wait(EC.visibilityOf(todoPage.formErrorContentTodo));
    expect(await todoPage.formErrorContentTodo.getText()).toEqual(
      `Content is required`
    );

    done();
  });

  it('Add Todo', async (done) => {
    const buttonAdd = todoPage.buttonAdd;

    await buttonAdd.click();
    const newInputValues = await todoPage.addNewTodo();
    expect(await todoPage.getToDoValueFromAddModal()).toEqual(newInputValues);

    const buttonSubmit = todoPage.buttonSubmit;
    await buttonSubmit.click();

    await browser.wait(EC.invisibilityOf(todoPage.modalTodo));
    expect(todoPage.getTitleOfLastTodo()).toContain('test');

    done();
  });

  it('The edit todo button works', async (done) => {
    const tableTodo = todoPage.tableTodo;
    await browser.wait(EC.visibilityOf(tableTodo));

    const buttonEditTodo = todoPage.buttonEdit;
    await buttonEditTodo.click();
    expect(await todoPage.modalTodoIsPresent()).toBe(true);

    done();
  });

  it('Validate Form Edit', async (done) => {
    const tableTodo = todoPage.tableTodo;
    await browser.wait(EC.visibilityOf(tableTodo));

    const numberTodo = (await todoPage.listTodo).length;
    if (numberTodo > 0) {
      const buttonEdit = todoPage.buttonEdit;
      await buttonEdit.click();
      await browser.wait(EC.visibilityOf(todoPage.modalTodo));

      const formInputTitleTodo = todoPage.formInputTitleTodo;
      const formInputCreatorTodo = todoPage.formInputCreatorTodo;
      const formInputContentTodo = todoPage.formInputContentTodo;

      await formInputTitleTodo.clear();
      await formInputTitleTodo.sendKeys('.', Key.BACK_SPACE, Key.TAB);
      await browser.wait(EC.visibilityOf(todoPage.formErrorTitleTodo));
      expect(await todoPage.formErrorTitleTodo.getText()).toEqual(
        `Title is required`
      );

      await formInputCreatorTodo.clear();
      await formInputCreatorTodo.sendKeys('.', Key.BACK_SPACE, Key.TAB);
      await browser.wait(EC.visibilityOf(todoPage.formErrorCreatorTodo));
      expect(await todoPage.formErrorCreatorTodo.getText()).toEqual(
        `Creator is required`
      );

      await formInputContentTodo.clear();
      await formInputContentTodo.sendKeys('.', Key.BACK_SPACE, Key.TAB);
      await browser.wait(EC.visibilityOf(todoPage.formErrorContentTodo));
      expect(await todoPage.formErrorContentTodo.getText()).toEqual(
        `Content is required`
      );
    }

    done();
  });

  it('Edit Todo', async (done)  => {
    const tableTodo = todoPage.tableTodo;
    await browser.wait(EC.visibilityOf(tableTodo));

    const numberTodo = (await todoPage.listTodo).length;
    if (numberTodo > 0) {
      const buttonEdit = todoPage.buttonEdit;
      buttonEdit.click();

      const modalTodo = todoPage.modalTodo;
      await browser.wait(EC.visibilityOf(modalTodo));

      const buttonSubmit = todoPage.buttonSubmit;
      const updateInputValues = await todoPage.editTodo();
      expect(await buttonSubmit.isEnabled()).toBe(true);
      expect(await todoPage.getToDoValueFromEditModal()).toEqual(updateInputValues);

      await buttonSubmit.click();
      await browser.wait(EC.invisibilityOf(modalTodo));
      await browser.refresh();
      expect(await todoPage.getTitleOfLastTodo()).toContain('test-edit');
    }

    done();
  });

  it('The delete todo button works', async (done) => {
    const tableTodo = todoPage.tableTodo;
    await browser.wait(EC.visibilityOf(tableTodo));

    const numberTodo = (await todoPage.listTodo).length;
    if (numberTodo > 0) {
      const buttonDeleteTodo = todoPage.buttonDelete;
      buttonDeleteTodo.click();
      expect(await browser.wait(EC.visibilityOf(tableTodo), 3000)).toBe(true);
    }

    done();
  });

  it('Delete Todo', async (done)  => {
    const tableTodo = todoPage.tableTodo;
    await browser.wait(EC.visibilityOf(tableTodo));

    const numberTodo = (await todoPage.listTodo).length;
    if (numberTodo > 0) {
      const buttonDeleteTodo = todoPage.buttonDelete;
      const titleTodoDelete = await todoPage.getTitleDeleteTodo();
      await buttonDeleteTodo.click();

      const buttonSubmitDelete = todoPage.buttonSubmitDelete;
      expect(await buttonSubmitDelete.isEnabled()).toBe(true);

      await buttonSubmitDelete.click();
      await browser.wait(EC.invisibilityOf(todoPage.dialogDelete));
      expect(await todoPage.getTitleOfLastTodo()).not.toContain(titleTodoDelete);
    }

    done();
  });
});
