import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SharedTestingModule,
  createReadingListItem
} from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { Store } from '@ngrx/store';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let dispatchSpy: jest.SpyInstance;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(Store);
	  dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to dispatch removeFromReadingList action ', () => {
    const item = createReadingListItem('A');
    component.removeFromReadingList(item);
    expect(dispatchSpy).toHaveBeenCalled;
  });

  it('should be able to dispatch markBookAsFinished action', () => {
    const item = createReadingListItem('A');
    component.markBookAsFinished(item);
    expect(dispatchSpy).toHaveBeenCalled;
  });
});
