import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  searchBooks,
  removeFromReadingList,
  confirmedAddToReadingList
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookConstant } from '../book.constant';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent {
  books$ = this.store.select(getAllBooks);

  searchForm = this.fb.group({
    term: '',
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));

    this.store
      .select(confirmedAddToReadingList)
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
          this.store.dispatch(
            removeFromReadingList({ item: { ...book, bookId: book.id } })
          );
        });
      });
  }
  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
