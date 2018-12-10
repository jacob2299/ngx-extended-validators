import { FormBuilder } from '@angular/forms';
import { ExtendedValidators } from './extended-validators';

describe('ExtendedValidators', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    formBuilder = new FormBuilder;
  });

  it('form should be invalid when two passwords are not the same', () => {
    const form = formBuilder.group({
      password: ['password'],
      confirmPassword: ['password1234']
    }, { validators: ExtendedValidators.confirmPassword('password', 'confirmPassword') });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when two passwords are the same', () => {
    const form = formBuilder.group({
      password: ['password'],
      confirmPassword: ['password']
    }, { validators: ExtendedValidators.confirmPassword('password', 'confirmPassword') });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the date is not on the given weekday', () => {
    const form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.dayOfWeek('mon')]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the date in on the given weekday', () => {
    const form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.dayOfWeek('thu')]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the date is not in the given date range', () => {
    let form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.dateRange({ from: '2018-12-20', to: '2019-01-04' })]
    });

    expect(form.valid).toBeFalsy();

    form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.dateRange({ from: '2018-11-11', to: '2018-12-05' })]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the date is in the given date range', () => {
    let form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.dateRange({ from: '2018-12-06', to: '2018-12-20' })]
    });

    expect(form.valid).toBeTruthy();

    form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.dateRange({ from: '2018-11-09', to: '2018-12-06' })]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the date is in the given date range', () => {
    let form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.notInDateRange({ from: '2018-12-01', to: '2019-01-04' })]
    });

    expect(form.valid).toBeFalsy();

    form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.notInDateRange({ from: '2018-11-11', to: '2018-12-07' })]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the date is not in the given date range', () => {
    let form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.notInDateRange({ from: '2018-11-06', to: '2018-12-01' })]
    });

    expect(form.valid).toBeTruthy();

    form = formBuilder.group({
      date: ['2018-12-06', ExtendedValidators.notInDateRange({ from: '2018-12-07', to: '2018-12-20' })]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the value is not a number', () => {
    const form = formBuilder.group({
      value: ['test', ExtendedValidators.number()]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the value is a number', () => {
    const form = formBuilder.group({
      value: [23, ExtendedValidators.number()]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the value is not a floating point', () => {
    const form = formBuilder.group({
      value: [23, ExtendedValidators.float()]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the value is a floating point', () => {
    const form = formBuilder.group({
      value: [2.4, ExtendedValidators.float()]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the value is not a valid dutch phone number', () => {
    const form = formBuilder.group({
      value: ['09574', ExtendedValidators.dutchPhone()]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the value is a valid dutch phone number', () => {
    const form = formBuilder.group({
      value: ['0509876385', ExtendedValidators.dutchPhone()]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the value is not a valid dutch mobile phone number', () => {
    const form = formBuilder.group({
      value: ['06874634', ExtendedValidators.dutchMobilePhone()]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the value is a valid dutch mobile phone number', () => {
    let form = formBuilder.group({
      value: ['0612438764', ExtendedValidators.dutchMobilePhone()]
    });

    expect(form.valid).toBeTruthy();

    form = formBuilder.group({
      value: ['+31620394846', ExtendedValidators.dutchMobilePhone()]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the value is not a valid dutch postal code', () => {
    const form = formBuilder.group({
      value: ['84KL', ExtendedValidators.dutchPostalCode()]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the value is a valid dutch postal code', () => {
    let form = formBuilder.group({
      value: ['8374LD', ExtendedValidators.dutchPostalCode()]
    });

    expect(form.valid).toBeTruthy();

    form = formBuilder.group({
      value: ['2394 OD', ExtendedValidators.dutchPostalCode()]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the value is not a valid iban', () => {
    const form = formBuilder.group({
      value: ['2834asdf2', ExtendedValidators.iban()]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the value is a valid iban', () => {
    const form = formBuilder.group({
      value: ['NL91ABNA0417164300', ExtendedValidators.iban()]
    });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the current field is empty and the other field equals the expected value', () => {
    const form = formBuilder.group({
      currentField: [''],
      otherField: ['value']
    }, { validators: ExtendedValidators.requiredIf('currentField', 'otherField', 'value', true) });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the current field is not empty and the other field equals the expected value', () => {
    const form = formBuilder.group({
      currentField: ['new value'],
      otherField: ['value']
    }, { validators: ExtendedValidators.requiredIf('currentField', 'otherField', 'value', true) });

    expect(form.valid).toBeTruthy();
  });

  it('form should be valid when the current field is empty and the other field does not equals the expected value', () => {
    const form = formBuilder.group({
      currentField: [''],
      otherField: ['no value']
    }, { validators: ExtendedValidators.requiredIf('currentField', 'otherField', 'value') });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the current field is empty and the other field does not equals the expected value', () => {
    const form = formBuilder.group({
      currentField: [''],
      otherField: ['no value']
    }, { validators: ExtendedValidators.requiredUnless('currentField', 'otherField', 'value') });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the current field is empty and the other field equals the expected value', () => {
    const form = formBuilder.group({
      currentField: [''],
      otherField: ['value']
    }, { validators: ExtendedValidators.requiredUnless('currentField', 'otherField', 'value', true) });

    expect(form.valid).toBeTruthy();
  });

  it('form should be valid when the current field is not empty and the other field does not equals the expected value', () => {
    const form = formBuilder.group({
      currentField: ['another value'],
      otherField: ['no value']
    }, { validators: ExtendedValidators.requiredUnless('currentField', 'otherField', 'value', true) });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the current field is empty and the other field is not', () => {
    const form = formBuilder.group({
      currentField: [''],
      otherField: ['value']
    }, { validators: ExtendedValidators.requiredIfOtherFieldExists('currentField', 'otherField') });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the current field is empty and the other field is empty', () => {
    const form = formBuilder.group({
      currentField: [''],
      otherField: ['']
    }, { validators: ExtendedValidators.requiredIfOtherFieldExists('currentField', 'otherField') });

    expect(form.valid).toBeTruthy();
  });

  it('form should be valid when the current field is not empty and the other field is not empty', () => {
    const form = formBuilder.group({
      currentField: ['value'],
      otherField: ['value']
    }, { validators: ExtendedValidators.requiredIfOtherFieldExists('currentField', 'otherField') });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the current field is empty and the other field is empty', () => {
    const form = formBuilder.group({
      currentField: [''],
      otherField: ['']
    }, { validators: ExtendedValidators.requiredUnlessOtherFieldExists('currentField', 'otherField') });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the current field is empty and the other field is not', () => {
    const form = formBuilder.group({
      currentField: [''],
      otherField: ['value']
    }, { validators: ExtendedValidators.requiredUnlessOtherFieldExists('currentField', 'otherField') });

    expect(form.valid).toBeTruthy();
  });

  it('form should be valid when the current field is not empty and the other field is empty', () => {
    const form = formBuilder.group({
      currentField: ['value'],
      otherField: ['']
    }, { validators: ExtendedValidators.requiredUnlessOtherFieldExists('currentField', 'otherField') });

    expect(form.valid).toBeTruthy();
  });

  it('form should be invalid when the date is not on the given date', () => {
    let form = formBuilder.group({
      date: ['06-05-2018', ExtendedValidators.date('03-04-2018', 'DD-MM-YYYY')]
    });

    expect(form.valid).toBeFalsy();

    form = formBuilder.group({
      date: ['2018-05-06', ExtendedValidators.date('2018-04-03')]
    });

    expect(form.valid).toBeFalsy();
  });

  it('form should be valid when the date is on the given date', () => {
    let form = formBuilder.group({
      date: ['06-05-2018', ExtendedValidators.date('06-05-2018', 'DD-MM-YYYY')]
    });

    expect(form.valid).toBeTruthy();

    form = formBuilder.group({
      date: ['2018-05-06', ExtendedValidators.date('2018-05-06')]
    });

    expect(form.valid).toBeTruthy();
  });
});
