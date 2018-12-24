import { FormGroup, ValidationErrors, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import * as moment_ from 'moment';
import { DateRange } from './interfaces/date-range.interface';
import { Moment } from 'moment';
const moment = moment_;

const days = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6
};

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

function areValidDates(...dates: Moment[]): boolean {
  for (const date of dates) {
    if (!date.isValid) {
      return false;
    }
  }

  return true;
}

function invalidDateError(validator: string, ...dates: string[]): ValidationErrors {
  return { [validator]: { error: 'Invalid date', dates: dates.join(', ') } };
}

// @dynamic
export class ExtendedValidators extends Validators {
  /**
   * @description Check if 2 passwords are the same
   * @param passwordField The password field
   * @param confirmPasswordField The confirm password field
   */
  public static confirmPassword(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors | undefined => {
      if (isEmptyInputValue(group.get(passwordField).value) || isEmptyInputValue(group.get(confirmPasswordField).value)) {
        return undefined;
      }

      if (group.get(passwordField).value === group.get(confirmPasswordField).value) {
        return undefined;
      }

      return { 'confirmPassword': { password: group.get(passwordField).value, confirmPassword: group.get(confirmPasswordField).value } };
    };
  }

  /**
   * @description Check if the day is on the given day of the week
   *
   * Accepted values:
   * mon
   * tue
   * wed
   * thu
   * fri
   * sat
   * sun
   *
   * @param day The day of the week
   * @param format The format example: DD-MM-YYYY
   * @param locale The locale example: nl
   */
  public static dayOfWeek(day: string, format: string = 'YYYY-MM-DD', locale: string = 'nl'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      if (!areValidDates(moment(control.value, format))) {
        return invalidDateError('dayOfWeek', control.value);
      }

      const daynumber = days[day];
      if (moment(control.value, format).locale(locale).weekday() === daynumber) {
        return undefined;
      }

      return { 'dayOfWeek': { currentValue: control.value, expectedValue: day } };
    };
  }

  /**
   * @description Check if the date is in the given date range
   * @param range The date range
   * @param format The format example: DD-MM-YYYY
   * @param reverse Validator in reverse
   */
  public static dateRange(range: DateRange, format: string = 'YYYY-MM-DD', reverse: boolean = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const value = moment(control.value, format);
      const from = moment(range.from, format);
      const to = moment(range.to, format);

      if (!areValidDates(value, from, to)) {
        if (reverse) {
          return invalidDateError('notInDateRange', control.value, range.from, range.to);
        }

        return invalidDateError('dateRange', control.value, range.from, range.to);
      }

      if (value.isBetween(from.subtract(1, 'd'), to.add(1, 'd'))) {
        if (reverse) {
          return { 'notInDateRange': { value, from, to } };
        }

        return undefined;
      }

      if (reverse) {
        return undefined;
      }

      return { 'dayOfWeek': { value, from, to } };
    };
  }

  /**
   * @description Check if the date is not in the given date range
   * @param range The date range
   * @param format The format DD-MM-YYYY
   */
  public static notInDateRange(range: DateRange, format: string = 'YYYY-MM-DD'): ValidatorFn {
    return this.dateRange(range, format, true);
  }

  /**
   * @description Check if the value is a number
   */
  public static number(): ValidatorFn {
    return ExtendedValidators.pattern(/^[0-9]*$/);
  }

  /**
   * @description Check if the value is a float
   */
  public static float(): ValidatorFn {
    return ExtendedValidators.pattern(/^[0-9]+\.[0-9]+$/);
  }

  /**
   * @description Check if the value is a valid dutch phone number
   */
  public static dutchPhone(): ValidatorFn {
    return ExtendedValidators.pattern(/^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/);
  }

  /**
   * @description Check if the value is a valid dutch mobile phone number
   */
  public static dutchMobilePhone(): ValidatorFn {
    return ExtendedValidators.pattern(/^(((\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i);
  }

  /**
   * @description Check if the value is a valid dutch postalcode
   */
  public static dutchPostalCode(): ValidatorFn {
    return ExtendedValidators.pattern(/^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i);
  }

  /**
   * @description Check if the value is a valid iban
   */
  public static iban(): ValidatorFn {
    return ExtendedValidators.pattern(/^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/);
  }

  /**
   * @description Make the current field required if the other field equals the expected value
   * @param currentField The current field
   * @param otherField The other field
   * @param expectedValue The expected value
   * @param strict Should the comparison be strict
   */
  public static requiredIf(currentField: string, otherField: string, expectedValue: any, strict: boolean = false): ValidatorFn {
    return (group: FormGroup): ValidationErrors | undefined => {
      const currentControl = group.get(currentField);
      const otherControl = group.get(otherField);

      if (strict && otherControl.value !== expectedValue || !strict && otherControl != expectedValue) {
        return undefined;
      }

      if (strict && otherControl.value === expectedValue && !isEmptyInputValue(currentControl.value)) {
        return undefined;
      }

      return { 'requiredIf': { currentValue: currentControl.value, otherValue: otherControl.value, expectedValue } };
    };
  }

  /**
   * @description Make the current field required unless the other field equals the expected value
   * @param currentField The current field
   * @param otherField The other field
   * @param expectedValue The expected value
   * @param strict Should the comparison be strict
   */
  public static requiredUnless(currentField: string, otherField: string, expectedValue: any, strict: boolean = false): ValidatorFn {
    return (group: FormGroup): ValidationErrors | undefined => {
      const currentControl = group.get(currentField);
      const otherControl = group.get(otherField);

      if (strict && otherControl.value === expectedValue || !strict && otherControl == expectedValue) {
        return undefined;
      }

      if (strict && otherControl.value !== expectedValue && !isEmptyInputValue(currentControl.value) || !strict && otherControl != expectedValue && !isEmptyInputValue(currentControl.value)) {
        return undefined;
      }

      return { 'requiredUnless': { currentValue: currentControl.value, otherValue: otherControl.value, expectedValue } };
    };
  }

  /**
   * @description Make the current field required if the other field is not empty
   * @param currentField The current field
   * @param otherField The other field
   */
  public static requiredIfFieldExists(currentField: string, otherField: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors | undefined => {
      const currentControl = group.get(currentField);
      const otherControl = group.get(otherField);

      if (isEmptyInputValue(otherControl.value)) {
        return undefined;
      }

      if (!isEmptyInputValue(currentControl.value)) {
        return undefined;
      }

      return { 'requiredIfFieldExists': { currentValue: currentControl.value, otherValue: otherControl.value } };
    };
  }

  /**
   * @description Make the current field required unless the other field is not empty
   * @param currentField The current field
   * @param otherField The other field
   */
  public static requiredUnlessFieldExists(currentField: string, otherField: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors | undefined => {
      const currentControl = group.get(currentField);
      const otherControl = group.get(otherField);

      if (!isEmptyInputValue(otherControl.value)) {
        return undefined;
      }

      if (isEmptyInputValue(otherControl.value) && !isEmptyInputValue(currentControl.value)) {
        return undefined;
      }

      return { 'requiredUnlessFieldExists': { currentValue: currentControl.value, otherValue: otherControl.value } };
    };
  }

  /**
   * @description Check if the current field is on the given day
   * @param expectedDate The expected date
   * @param format The format example: DD-MM-YYYY
   */
  public static date(expectedDate: string, format: string = 'YYYY-MM-DD'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      if (!areValidDates(moment(control.value, format), moment(expectedDate, format))) {
        return invalidDateError('date', control.value, expectedDate);
      }

      if (moment(control.value, format).isSame(moment(expectedDate, format))) {
        return undefined;
      }

      return { 'date': { currentValue: control.value, expectedValue: expectedDate } };
    };
  }

  /**
   * @description Check if the current date is before the given date
   * @param date The expected date
   * @param format The format example: DD-MM-YYYY
   */
  public static dateBefore(date: string, format: string = 'YYYY-MM-DD'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const currentDate = moment(control.value, format);
      const expectedDate = moment(date, format);

      if (!areValidDates(currentDate, expectedDate)) {
        return invalidDateError('dateBefore', control.value, date);
      }

      if (currentDate.isBefore(expectedDate)) {
        return undefined;
      }

      return { 'dateBefore': { currentValue: control.value, expectedValue: date } };
    };
  }

  /**
   * @description Check if the current date is after the given date
   * @param date The expected date
   * @param format The format example: DD-MM-YYYY
   */
  public static dateAfter(date: string, format: string = 'YYYY-MM-DD'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const currentDate = moment(control.value, format);
      const expectedDate = moment(date, format);

      if (!areValidDates(currentDate, expectedDate)) {
        return invalidDateError('dateBefore', control.value, date);
      }

      if (currentDate.isAfter(expectedDate)) {
        return undefined;
      }

      return { 'dateAfter': { currentValue: control.value, expectedValue: date } };
    };
  }

  /**
   * @description Check if the current date is before today's date
   * @param format The format example: DD-MM-YYYY
   * @param reverse Validator in reverse
   */
  public static beforeToday(format: string = 'YYYY-MM-DD', reverse: boolean = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const today = moment();
      const currentDate = moment(control.value, format);

      if (!areValidDates(currentDate)) {
        return invalidDateError('beforeToday', control.value);
      }

      if (currentDate.isBefore(today)) {
        if (reverse) {
          return { 'afterToday': { currentValue: control.value } };
        }

        return undefined;
      }

      if (reverse) {
        return undefined;
      }

      return { 'beforeToday': { currentValue: control.value } };
    };
  }

  /**
   * @description Check if the current date is after today's date
   * @param format The format example: DD-MM-YYYY
   */
  public static afterToday(format: string = 'YYYY-MM-DD'): ValidatorFn {
    return this.beforeToday(format, true);
  }

  /**
   * @description Check if the current value is a boolean
   */
  public static boolean(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | undefined => {
      if (control.value === true || control.value === false || control.value === 1 || control.value === 0) {
        return undefined;
      }

      return { 'boolean': { currentValue: control.value } };
    };
  }
}
