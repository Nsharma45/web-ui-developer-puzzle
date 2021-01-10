import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import {
  SharedTestingModule,
  createBook,
  createReadingListItem,
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should be able to load books', (done) => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });
  describe('addBook$', () => {
    it('Should be able to add book to reading list', fakeAsync(() => {
      actions = new ReplaySubject();
      const book: Book = createBook('A');
      actions.next(
        ReadingListActions.addToReadingList({ book: book, undoAction: false })
      );
      effects.addBook$.subscribe(() => {});
      tick(5000);
      httpMock.expectOne('/api/reading-list').flush([]);
    }));
  });

  describe('removeBook$', () => {
    it('Shouldbe able to remove book from reading list', fakeAsync((done) => {
      actions = new ReplaySubject();
      const item: ReadingListItem = createReadingListItem('A');
      actions.next(
        ReadingListActions.removeFromReadingList({
          item: item,
          undoAction: false,
        })
      );
      effects.removeBook$.subscribe((action) => {});
      tick(5000);
      httpMock.expectOne('/api/reading-list/A').flush([]);
    }));
  });
});
