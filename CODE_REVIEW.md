# Task 1

Below are the code smells, web Accessibility and Improvments:


## Code smells


1. Test cases are failing for reading-list.reducer.spec.ts.
2. Reading list actions confirmedAddToReadingList and confirmedRemoveFromReadingList are having unwanted properties.
3. Functions are missing specifiers like public or private.
4. The subscription is not destroyed at some places. like in book-search.component.ts file, on Oninit():
	this.store.select(getAllBooks).subscribe(books => {
	this.books = books;
	});
5. Considering coding best practices, a relevant term can be used instead of 'b' at some of the places like
	*ngFor="let b of readingList\$ | async"
	can be replaced with
	*ngFor="let readingListItem of readingList\$ | async"


### Improvements

1. Application is not responsive as a result the UI is not looking good in mobile devices.
2. No error message has been displayed to let user know when something goes wrong with network or API.
3. Memory leakage in dispatching action can be avoided using async pipe.
4. Angular pipes can be used for formatting. Like for date format a function has been written. Instead we can use date pipe.
5. Action names can be exported via a single constant.

### Accessibilities

1. Buttons do not have an accessible name like the search button
2. Background and foreground colors do not have a sufficient contrast ratio. i.e the toggle button to open and close reading list

### Accessibilities violation which is not captured by light house : 

1. The reading list button used to toggle the reading list items list has been updated to be seen as button. So that it can serve its purpose.
2. Some of the buttons like close and add to read are not having the aria-labels or titles.
3. Image tag missing alt attribute. Hence can be added for handling cases when image is not present.
4. The text color of text shown at center when none of the books are shown when the page is loaded initially is bit lighter and can be changes to bit darker color. 


#### Fixes

1. Fixed failing test cases for reading-list.reducer.spec.ts.
2. Added few media query to make the app responsive in Mobile devices.
3. Missed accessibilities are added and its passed 100% using lighthouse.
4. Removed the subscription from book-search.component.ts file to book-search.component.html using async pipe. So that no need to destroy it separately.
5. Used Date pipe to format date in book-search html file. And removed function from ts file.

