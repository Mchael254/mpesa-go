import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CanComponentDeactivate, ReceiptPreviewGuard } from './receipt-preview-guard.service';
import { Observable } from 'rxjs';

describe('ReceiptPreviewGuard', () => {
  let guard: ReceiptPreviewGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // No need to import other modules, just provide the guard
      providers: [ReceiptPreviewGuard]
    });
    // Inject the guard instance
    guard = TestBed.inject(ReceiptPreviewGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Test Case 1: The component being deactivated has the method and allows navigation.
  it('should allow deactivation if the component returns true', () => {
    // Arrange: Create a mock component that implements the interface
    // and its canDeactivate method returns true.
    const mockComponent: CanComponentDeactivate = {
      canDeactivate: () => true,
    };
    
    // spyOn is used to check if the method was called
    const canDeactivateSpy = jest.spyOn(mockComponent, 'canDeactivate');

    // Act: Call the guard's canDeactivate method with the mock component
    const canDeactivateResult = guard.canDeactivate(mockComponent);

    // Assert
    expect(canDeactivateSpy).toHaveBeenCalledTimes(1); // Verify the component's method was called
    expect(canDeactivateResult).toBe(true); // Verify the guard returned the correct boolean
  });

  // Test Case 2: The component being deactivated has the method and blocks navigation.
  it('should block deactivation if the component returns false', () => {
    // Arrange: Create a mock component whose method returns false.
    const mockComponent: CanComponentDeactivate = {
      canDeactivate: () => false,
    };
    
    const canDeactivateSpy = jest.spyOn(mockComponent, 'canDeactivate');

    // Act
    const canDeactivateResult = guard.canDeactivate(mockComponent);

    // Assert
    expect(canDeactivateSpy).toHaveBeenCalledTimes(1);
    expect(canDeactivateResult).toBe(false); // Verify the guard returned the correct boolean
  });
  
  // Test Case 3: The component does NOT have the required method.
  it('should allow deactivation by default if the component does not have a canDeactivate method', () => {
    // Arrange: Create a mock component that does not implement the interface.
    // We cast to `any` to satisfy TypeScript for the test.
    const mockComponentWithNoMethod: any = {};

    // Act
    const canDeactivateResult = guard.canDeactivate(mockComponentWithNoMethod);

    // Assert
    // The guard's logic should default to true in this case.
    expect(canDeactivateResult).toBe(true);
  });
  
  // Test Case 4: Testing asynchronous return value (Observable<boolean>)
  it('should handle an Observable<boolean> return value from the component', (done) => {
    // Arrange: Create a mock component whose method returns an Observable of `true`.
    const mockComponent: CanComponentDeactivate = {
      canDeactivate: () => of(true), // `of` from RxJS creates a simple observable
    };

    // Act: The result will be an Observable.
    const canDeactivateResult = guard.canDeactivate(mockComponent) as Observable<boolean>;

    // Assert: We must subscribe to the observable to get its value.
    // The `done` callback tells Jest this is an asynchronous test.
    canDeactivateResult.subscribe(result => {
      expect(result).toBe(true);
      done(); // Signal that the async test has completed.
    });
  });
});