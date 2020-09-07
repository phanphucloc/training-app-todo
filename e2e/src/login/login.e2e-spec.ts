import { LoginPage } from './login.po';
import { TodoPage } from '../todo/todo.po';
import { browser, protractor, ExpectedConditions, ElementFinder, Key } from 'protractor';

describe('protractor-test - Login page', () => {
  let loginPage: LoginPage;
  let todoPage: TodoPage;

  const EC = protractor.ExpectedConditions;

  beforeEach(async () => {
    loginPage = new LoginPage();
    todoPage = new TodoPage();
    await loginPage.navigateTo();
  });


  it('The button must be disabled when the form is empty', async (done) => {

    const buttonSubmit = loginPage.buttonSubmit;
    const inputEmail = loginPage.inputEmail;
    const inputPassword = loginPage.inputPassword;

    await inputEmail.sendKeys();
    await inputPassword.sendKeys();

    expect(await buttonSubmit.isEnabled()).toBe(false);

    done();
  });

  it('Form validate format email', async (done) => {

    const inputEmail = loginPage.inputEmail;

    await inputEmail.sendKeys('email.com');
    await inputEmail.sendKeys(Key.TAB);
    await browser.wait(EC.visibilityOf(loginPage.errorEmail));

    expect(await loginPage.errorEmail.getText()).toEqual(`Email format is incorrect`);

    done();
  });

  it('Form validate required email', async (done) => {

    const inputEmail = loginPage.inputEmail;

    await inputEmail.sendKeys();
    await inputEmail.sendKeys(Key.TAB);
    await browser.wait(EC.visibilityOf(loginPage.errorEmail));

    expect(await loginPage.errorEmail.getText()).toEqual(`Email is required`);

    done();
  });

  it('Form validate required password', async (done) => {

    const inputPassword = loginPage.inputPassword;

    await inputPassword.sendKeys();
    await inputPassword.sendKeys(Key.TAB);
    await browser.wait(EC.visibilityOf(loginPage.errorPassword));

    expect(await loginPage.errorPassword.getText()).toEqual(`password is required`);

    done();
  });

  it('when user trying to login with wrong user he should stay on “login” page and see error notification', async (done) => {

    await loginPage.login({
      username: 'wrong-name@gmail.com',
      password: 'wrong-password',
    });
    await browser.wait(EC.visibilityOf(loginPage.errorMessageFromRequest));
    expect( await loginPage.errorMessageFromRequest.getText()).not.toBeNull();

    done();
  });

  it('when login is successful — he should redirect to default list todo page', async (done) => {

    await loginPage.login({
      username: 'ppldhsp@gmail.com',
      password: '123456'
    });
    expect(
      await browser
        .wait(protractor.ExpectedConditions.urlContains('/todo/list'))
        .catch(() => false)
    ).toBeTruthy(`Url match could not succeed`);

    done();
  });
});
