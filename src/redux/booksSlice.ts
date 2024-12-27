import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Book {
  id: string;
  title: string;
  isbn: string;
  authors: string[];
  genre: string;
  coverImageUrl?: string;
}

interface BooksState {
  books: Book[];
}

const initialState: BooksState = {
  books: [],
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook(state, action: PayloadAction<Book>) {
      state.books.push(action.payload);
    },
    updateBook(state, action: PayloadAction<Book>) {
      const index = state.books.findIndex((book) => book.id === action.payload.id);
      if (index >= 0) {
        state.books[index] = action.payload;
      }
    },
    deleteBook(state, action: PayloadAction<string>) {
      state.books = state.books.filter((book) => book.id !== action.payload);
    },
  },
});

export const { addBook, updateBook, deleteBook } = booksSlice.actions;
export default booksSlice.reducer;
