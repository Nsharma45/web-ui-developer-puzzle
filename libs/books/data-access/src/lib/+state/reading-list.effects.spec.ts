import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import {
  SharedTestingModule,
  createBook,
  createReadingListItem
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('addBook$', () => {
    it('should add book', done => {
      actions = new ReplaySubject();
      const book = createBook('A');
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(ReadingListActions.confirmedAddToReadingList());
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('removeBook$', () => {
    it('should remove book', done => {
      actions = new ReplaySubject();
      const item = createReadingListItem('A');
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList()
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/A').flush([]);
    });
  });

  describe('markBookAsFinished$', () => {
    it('should remove book', done => {
      actions = new ReplaySubject();
      const item = createReadingListItem('A');
      actions.next(ReadingListActions.markBookAsFinished({ item }));

      effects.markBookAsFinished$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedMarkBookAsFinished()
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/A/finished').flush([]);
    });
  });
});
