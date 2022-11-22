import { kioscoTemplatePage } from './app.po';

describe('kiosco App', function() {
  let page: kioscoTemplatePage;

  beforeEach(() => {
    page = new kioscoTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
