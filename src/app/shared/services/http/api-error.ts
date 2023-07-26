/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

export interface ApiError {
  status: string;
  errorType: string;
  message: string;
  errors: string[];
}
