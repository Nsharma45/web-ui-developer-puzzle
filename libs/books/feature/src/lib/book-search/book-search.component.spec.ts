import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { Store } from '@ngrx/store';
import { createBook } from '@tmo/shared/testing';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('dispatch selected books to reading list via addBookToReadingList function', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.addBookToReadingList(createBook('A'));
    expect(dispatchSpy).toHaveBeenCalled;
  });
});
