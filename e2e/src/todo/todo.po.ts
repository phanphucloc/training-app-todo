import { browser, by, element, promise } from 'protractor';

export class TodoPage {

  public navigateTo(): any {
    return browser.get('/todo/list');
  }

  public getPageTitleText(): promise.Promise<string> {
    return element(by.css('.title-page')).getText();
  }

}
