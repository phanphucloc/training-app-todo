import { LoginPage } from './login.po';
import { TodoPage } from '../todo/todo.po';

describe('protractor-test - Login page', () => {
  let loginPage: LoginPage;
  let todoPage: TodoPage;

  const wrongUserLogin = {
    username: 'wrong-name',
    password: 'wrong-password'
  };

  beforeEach(() => {
    loginPage = new LoginPage();
    todoPage = new TodoPage();
  });

  it('when user trying to login with wrong user he should stay on “login” page and see error notification', async () => {
    loginPage.navigateTo();
    await loginPage.login(wrongUserLogin);
    setTimeout(() => {
        expect(loginPage.getPageTitleText()).toEqual('Login');
        expect(loginPage.getErrorMessage()).toEqual('Username or password is incorrect');
    }, 3000);
  });

  it('when user trying to login with wrong user he should stay on “login” page and see error notification', async () => {
    loginPage.navigateTo();
    await loginPage.login(wrongUserLogin);
    setTimeout(() => {
        expect(loginPage.getPageTitleText()).toEqual('Login');
        expect(loginPage.getErrorMessage()).toEqual('Username or password is incorrect');
    }, 3000);
  });

  it('when login is successful — he should redirect to default list todo page', async () => {
    loginPage.navigateTo();
    loginPage.login();
    setTimeout(() => {
        expect(todoPage.getPageTitleText()).toEqual('List Todo');
    }, 3000);
  });

});

