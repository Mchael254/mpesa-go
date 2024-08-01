export interface GenericResponseFMS<F> {
  data: F[];
  msg: string;
  success: boolean;
}
