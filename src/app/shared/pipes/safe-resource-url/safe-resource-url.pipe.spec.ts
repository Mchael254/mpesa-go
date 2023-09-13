import { SafeResourceUrlPipe } from './safe-resource-url.pipe';
import {DomSanitizer} from "@angular/platform-browser";

describe('SafeResourceUrlPipe', () => {
  let sanitizer = {
    bypassSecurityTrustResourceUrl: jest.fn()
  } as unknown as DomSanitizer;
  const pipe = new SafeResourceUrlPipe(sanitizer);


  it('should call bypassSecurityTrustResourceUrl with the provided URL', () => {
    jest.spyOn(sanitizer, 'bypassSecurityTrustResourceUrl');
    const url = 'https://example.com';

    pipe.transform(url);
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(url);
  });

  it('should return the sanitized URL', () =>{
  const sanitizedUrl = 'safe-url';

  jest.spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').mockReturnValue(sanitizedUrl);

    const url = 'https://example.com';
    const result = pipe.transform(url);
    expect(result).toBe(sanitizedUrl);
  });

});
