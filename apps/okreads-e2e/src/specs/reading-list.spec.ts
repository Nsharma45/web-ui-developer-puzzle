import { $, browser, ExpectedConditions, $$ } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should be able to toggle the reading list container', async () => {
    await browser.get('/');

    await $('[data-testing="toggle-reading-list"]').click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it("Then: should be able to mark book as finished and change the text of button from 'Want to read' to 'Finshed' ", async () => {
    await browser.get('/');

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('java');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');

    if (items.length) {
      let finishedBookCount,
        finishedBookCountBefore,
        finishedBookCountAfter = 0;

      //count number of finished book initially
      finishedBookCount = $$(
        '.book--content--info button:not(:enabled)'
      ).filter(async a => (await a.getText()) === 'Finished');
      finishedBookCountBefore = (await finishedBookCount).length;

      await $$('.book--content--info button:enabled').first().click();

      await $('[data-testing="toggle-reading-list"]').click();

      await $$('[data-testing="finished-button"]').last().click();

      //count number of finished book when a book has been marked as finished
      finishedBookCount = $$(
        '.book--content--info button:not(:enabled)'
      ).filter(async item => (await item.getText()) === 'Finished');
      finishedBookCountAfter = (await finishedBookCount).length;

      //the count after marking a book as finished should be increase by one from the initial count
      expect(finishedBookCountAfter).toEqual(finishedBookCountBefore + 1);
    }
  });
});
