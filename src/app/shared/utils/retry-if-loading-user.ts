import { MonoTypeOperatorFunction, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, startWith } from 'rxjs/operators';

export function retryIfLoadingUser<T>(isLoading$: Observable<boolean>): MonoTypeOperatorFunction<T> {
  return function(source: Observable<T>): Observable<T> {

    let isLoadingSubscription!: Subscription;
    let subscription!: Subscription;
    let syncSub = false;

    return new Observable<T>(subscriber => {

      const subscribeForRetryIfLoadingUser = () => {
        isLoadingSubscription = isLoading$.pipe(
          startWith(true),
          distinctUntilChanged()
        ).subscribe((isLoading) => {

          if (isLoading === false) {

            if (isLoadingSubscription) {
              isLoadingSubscription.unsubscribe();
              // isLoadingSubscription = null;
              syncSub = false;
            }

            if (subscription) {
              subscription.unsubscribe();
              // subscription = null;
            }


            subscription = source.subscribe({
              next(value) {
                subscriber.next(value);
              },

              error(err) {
                subscriber.error(err);
              },

              complete() {
                subscriber.complete();
              }
            });
          }
        });
      };

      subscribeForRetryIfLoadingUser();

      return () => {
        if (subscription) {
          subscription.unsubscribe();
          // subscription = null;
        }

        if (isLoadingSubscription) {
          isLoadingSubscription.unsubscribe();
          // isLoadingSubscription = null;
        }
      };
    });
  };
}

