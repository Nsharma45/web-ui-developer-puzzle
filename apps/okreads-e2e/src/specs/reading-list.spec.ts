import { $, browser, ExpectedConditions, $$ } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');

    await $('[data-testing="toggle-reading-list"]').click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('should be able to undo the added book', async () => {
    await browser.get('/');

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('java');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');

    if (items.length) {
      //initial count of reading list items
      const readingListItems = await $$('[data-testing="reading-list-item"]');

      await $$('.book--content--info button:enabled').first().click();

      await browser.executeScript(` const undoButton = document.querySelector("simple-snack-bar button");
      undoButton.click();
    `);

      await $('[data-testing="toggle-reading-list"]').click();

      await browser.wait(
        ExpectedConditions.textToBePresentInElement(
          $('[data-testing="reading-list-container"]'),
          'My Reading List'
        )
      );
      //count of reading list items after undo action is performed on book add
      const readingListItemsAfterUndo = await $$(
        '[data-testing="reading-list-item"]'
      );

      expect(readingListItems.length).toEqual(readingListItemsAfterUndo.length);
    }
  });

  it('should be able to undo the removal of book', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('java');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).toBeGreaterThan(1);

    if (items.length) {
      //initial count of reading list items
      const readingListItems = await $$('[data-testing="reading-list-item"]');

      await $$('.book--content--info button:enabled').first().click();

      await $('[data-testing="toggle-reading-list"]').click();

      await browser.wait(
        ExpectedConditions.textToBePresentInElement(
          $('[data-testing="reading-list-container"]'),
          'My Reading List'
        )
      );
      await $$('[data-testing="remove-from-list"]').last().click();

      await browser.executeScript(` const undoButton = document.querySelector("simple-snack-bar button");
        undoButton.click();
      `);

      //count of reading list items when book removal undo action is performed
      const readingListItemsAfterUndo = await $$(
        '[data-testing="reading-list-item"]'
      );

      expect(readingListItemsAfterUndo.length).toEqual(
        readingListItems.length + 1
      );
    }
  });
});
