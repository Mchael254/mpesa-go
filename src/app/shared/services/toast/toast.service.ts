import { Injectable } from '@angular/core';
import { ToastNotificationInitializer, DialogLayoutDisplay, AppearanceAnimation, DisappearanceAnimation, ToastPositionEnum, ToastUserViewTypeEnum } from '@costlydeveloper/ngx-awesome-popup';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  message(name, title) {
    const newToastNotification = new ToastNotificationInitializer();
    newToastNotification.setTitle(title);
    // newToastNotification.setTitle('Jedi MasterJedi Master 🦾');
    newToastNotification.setMessage(name);

    // Choose layout color type
    newToastNotification.setConfig({
        layoutType: DialogLayoutDisplay.NONE, // SUCCESS | INFO | NONE | DANGER | WARNING
        animationIn: AppearanceAnimation.ELASTIC, // optional
        animationOut: DisappearanceAnimation.FLIP_OUT, // optional
        toastPosition: ToastPositionEnum.TOP_RIGHT,
        toastUserViewType: ToastUserViewTypeEnum.STANDARD, // STANDARD | SIMPLE
        autoCloseDelay: 3000,


    });

    // Simply open the toast
    newToastNotification.openToastNotification$();
}

danger(name, title) {
  const newToastNotification = new ToastNotificationInitializer();
  newToastNotification.setTitle(title);
  // newToastNotification.setTitle('Jedi MasterJedi Master 🦾');
  newToastNotification.setMessage(name);

  // Choose layout color type
  newToastNotification.setConfig({
      layoutType: DialogLayoutDisplay.DANGER, // SUCCESS | INFO | NONE | DANGER | WARNING
      animationIn: AppearanceAnimation.ELASTIC, // optional
      animationOut: DisappearanceAnimation.FLIP_OUT, // optional
      toastPosition: ToastPositionEnum.TOP_RIGHT,
      toastUserViewType: ToastUserViewTypeEnum.STANDARD, // STANDARD | SIMPLE
      autoCloseDelay: 6000,


  });

  // Simply open the toast
  newToastNotification.openToastNotification$();
}

info(name, title) {
  const newToastNotification = new ToastNotificationInitializer();
  newToastNotification.setTitle(title);
  // newToastNotification.setTitle('Jedi MasterJedi Master 🦾');
  newToastNotification.setMessage(name);

  // Choose layout color type
  newToastNotification.setConfig({
      layoutType: DialogLayoutDisplay.INFO, // SUCCESS | INFO | NONE | DANGER | WARNING
      animationIn: AppearanceAnimation.ELASTIC, // optional
      animationOut: DisappearanceAnimation.FLIP_OUT, // optional
      toastPosition: ToastPositionEnum.TOP_RIGHT,
      toastUserViewType: ToastUserViewTypeEnum.STANDARD, // STANDARD | SIMPLE
      autoCloseDelay: 3000,


  });

  // Simply open the toast
  newToastNotification.openToastNotification$();
}

success(name, title) {
  const newToastNotification = new ToastNotificationInitializer();
  newToastNotification.setTitle(title);
  // newToastNotification.setTitle('Jedi MasterJedi Master 🦾');
  newToastNotification.setMessage(name);

  // Choose layout color type
  newToastNotification.setConfig({
      layoutType: DialogLayoutDisplay.SUCCESS, // SUCCESS | INFO | NONE | DANGER | WARNING
      animationIn: AppearanceAnimation.ELASTIC, // optional
      animationOut: DisappearanceAnimation.FLIP_OUT, // optional
      toastPosition: ToastPositionEnum.TOP_RIGHT,
      toastUserViewType: ToastUserViewTypeEnum.STANDARD, // STANDARD | SIMPLE
      autoCloseDelay: 3000,


  });

  // Simply open the toast
  newToastNotification.openToastNotification$();
}


}
