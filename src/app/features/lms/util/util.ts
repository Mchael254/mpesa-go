export class Utils {

  static returnFreqOfPayment(value: string):string {
    if (value === null || value===undefined || value.trim().length === 0) {
      return null;
    } else if (value.trim().toLowerCase()==="m") {
      return "Monthly";
    }
    else if (value.trim().toLowerCase()==="w") {
      return "Weekly";
    }
    else if (value.trim().toLowerCase()==="y") {
      return "Yearly";
    }
    return null;

  }

}
