// Type declarations to fix pdfjs-dist compatibility issues
declare global {
  interface SetIterator<T> extends Iterator<T> {}
}

export {};
