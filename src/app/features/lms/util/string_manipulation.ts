export   class StringManipulation {

  static returnNullIfEmpty<T extends string | number | null>(value: T): T | null | Number  {
    if (value === null) {
      return null;
    } else if (typeof value === 'string' && value.trim() === '') {
      return null;
    } else if (!!Number(value)) {
      return Number(value);
    } else if (typeof value === 'string') {
      return value;
    }
    return null;

  }

  static isEmpty(value: string | number | null): boolean {
    if (value === null) {
      return true;
    } else if (typeof value === 'string' && value.trim() === '') {
      return true;
    } else if (!!Number(value)) {
      return false;
    } else if (typeof value === 'string' && value.trim() !== '') {
      return false;
    }
    return true;
  }
}
