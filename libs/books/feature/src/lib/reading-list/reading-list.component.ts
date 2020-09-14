import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getReadingList,
  removeFromReadingList,
  addToReadingList,
  confirmedRemoveFromReadingList
} from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookConstant } from '../book.constant';
import { take } from 'rxjs/operators';
@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store, private snackbar: MatSnackBar) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));

    this.store
      .select(confirmedRemoveFromReadingList)
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
          this.store.dispatch(
            addToReadingList({ book: { ...item, id: item.bookId } })
          );
        });
      });
  }
}
