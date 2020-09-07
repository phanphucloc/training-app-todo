import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';

export class LoginPage {

  public get inputEmail(): ElementFinder {
    return element(by.css('[name="email"]'));
  }

  public get inputPassword(): ElementFinder {
    return element(by.css('[name="password"]'));
  }

  public get buttonSubmit(): ElementFinder{
    return element(by.css('[type="submit"]'));
  }

  public get form(): ElementFinder{
    return element(by.css('form'));
  }

  public get errorEmail(): ElementFinder {
    return element(by.css('.error-email'));
  }

  public get errorPassword(): ElementFinder {
    return element(by.css('.error-password'));
  }

  public get errorMessageFromRequest(): ElementFinder {
    return element(by.css('.error-request'));
  }

  public navigateTo(): any {
    return browser.get('/todo/list');
  }

  public async login(userLogin: any): Promise<void> {
     await element(by.css('[name="email"]')).sendKeys(userLogin.username);
     await element(by.css('[name="password"]')).sendKeys(userLogin.password);
     await element(by.css('[type="submit"]')).click();
  }

}
