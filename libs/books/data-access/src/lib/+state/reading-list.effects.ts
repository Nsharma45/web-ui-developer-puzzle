import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, take } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookConstant } from './book.constant';
import { Store } from '@ngrx/store';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>('/api/reading-list')
          .pipe(
            map((data) =>
              ReadingListActions.loadReadingListSuccess({ list: data })
            )
          )
      ),
      catchError((error) =>
        of(ReadingListActions.loadReadingListError({ error }))
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, undoAction }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => {
            this.openSnackBar(
              BookConstant.ADD_ACTION,
              book,
              book.title + ' ' + BookConstant.ADDED_MSG,
              undoAction
            );
            return ReadingListActions.confirmedAddToReadingList();
          }),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, undoAction }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() => {
            this.openSnackBar(
              BookConstant.REMOVE_ACTION,
              item,
              item.title + ' ' + BookConstant.REMOVED_MSG,
              undoAction
            );
            return ReadingListActions.confirmedRemoveFromReadingList();
          }),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  openSnackBar(actionType, element, message, undoAction) {
    if (!undoAction)
      this.snackbar
        .open(message, 'undo', { duration: BookConstant.SNACKBAR_DURATION })
        .onAction()
        .subscribe(() => {
          if (actionType === BookConstant.ADD_ACTION) {
            this.store.dispatch(
              ReadingListActions.removeFromReadingList({
                item: { ...element, bookId: element.id },
                undoAction: true,
              })
            );
          } else {
            this.store.dispatch(
              ReadingListActions.addToReadingList({
                book: { ...element, id: element.bookId },
                undoAction: true,
              })
            );
          }
        });
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}
}
