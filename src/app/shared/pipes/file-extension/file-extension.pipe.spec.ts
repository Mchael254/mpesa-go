import { FileExtensionPipe } from './file-extension.pipe';


describe('FileExtensionPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new FileExtensionPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms "abc.pdf" to "pdf"', () => {
    expect(pipe.transform('abc.pdf')).toEqual('pdf');
  });

  it('transforms "image.png" to "png"', () => {
    expect(pipe.transform('image.png')).toEqual('png');
  });

  it('transforms "image" to ""', () => {
    expect(pipe.transform('image')).toEqual('');
  });

  it('transforms "null" to ""', () => {
    expect(pipe.transform(null)).toEqual('');
  });

});

