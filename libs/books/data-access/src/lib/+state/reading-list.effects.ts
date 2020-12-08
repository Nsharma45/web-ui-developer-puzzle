import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookConstant } from '../book.constant';
import { take } from 'rxjs/operators';

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
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() =>
            ReadingListActions.confirmedAddToReadingList()
              .pipe(take(1))
              .subscribe(() => {
                const snackBarRef = this.snackbar.open(
                  book.title + BookConstant.ADDED_MSG,
                  BookConstant.UNDO,
                  {
                    duration: BookConstant.SNACKBAR_DURATION,
                  }
                );

                snackBarRef.onAction().subscribe(() => {
                  ReadingListActions.removeFromReadingList({
                    item: { ...book, bookId: book.id },
                  });
                });
              })
          ),
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
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList()
              .pipe(take(1))
              .subscribe(() => {
                const snackbarRef = this.snackbar.open(
                  item.title + BookConstant.REMOVED_MSG,
                  BookConstant.UNDO,
                  {
                    duration: BookConstant.SNACKBAR_DURATION,
                  }
                );
                snackbarRef.onAction().subscribe(() => {
                  ReadingListActions.addToReadingList({
                    book: { ...item, id: item.bookId },
                  });
                });
              })
          ),
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

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snackbar: MatSnackBar
  ) {}
}
