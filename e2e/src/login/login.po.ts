import { browser, by, element, promise } from 'protractor';

export class LoginPage {
  private userLogin = {
    username: 'ppldhsp@gmail.com',
    password: '123456'
  };

  public navigateTo(): any {
    return browser.get('/todo/list');
  }

  public login(userLogin: any = this.userLogin): void {
    element(by.css('[name="email"]')).sendKeys(userLogin.username);
    element(by.css('[name="password"]')).sendKeys(userLogin.password);
    element(by.css('[type="submit"]')).click();
  }

  public getPageTitleText(): promise.Promise<string> {
    return element(by.css('app-root mat-card-title')).getText();
  }

  public getErrorMessage(): promise.Promise<string> {
    return element(by.css('.alert-danger')).getText();
  }
}
