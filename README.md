# ngx-extended-validators 
[![Build Status](https://travis-ci.org/jacob2299/ngx-extended-validators.svg?branch=develop)](https://travis-ci.org/jacob2299/ngx-extended-validators)

This is an extension on the angular 6+ validators

## Available validators

* Confirm password
* Date
* Day of the week
* Date range
* Not in date range
* Date before
* Date after
* Before today
* After today
* Number
* Float
* Boolean
* Dutch phone number
* Dutch mobile phone number
* Dutch postal code
* Dutch IBAN
* Required if
* Required unless
* Required if other field exists
* Required unles other field exists

## Install
`npm install ngx-extended-validators`

## Usage

### Confirm password
```javascript
const form = formBuilder.group({
  password: ['password'],
  confirmPassword: ['password']
}, { validators: ExtendedValidators.confirmPassword('password', 'confirmPassword') });
```

### Date
```javascript
const form = formBuilder.group({
  date: ['2018-05-06', ExtendedValidators.date('2018-05-06')]
});
```

### Day of the week
```javascript
const form = formBuilder.group({
  date: ['2018-12-06', ExtendedValidators.dayOfWeek('thu')]
});
```

### Date range
```javascript
const form = formBuilder.group({
  date: ['2018-12-06', ExtendedValidators.dateRange({ from: '2018-11-09', to: '2018-12-06' })]
});
```

### Not in date range
```javascript
const form = formBuilder.group({
  date: ['2018-12-06', ExtendedValidators.notInDateRange({ from: '2018-12-07', to: '2018-12-20' })]
});
```

### Date before
```javascript
const form = formBuilder.group({
  date: ['06-05-2018', ExtendedValidators.dateBefore('10-05-2018', 'DD-MM-YYYY')]
});
```

### Date after
```javascript
const form = formBuilder.group({
  date: ['06-05-2018', ExtendedValidators.dateAfter('01-05-2018', 'DD-MM-YYYY')]
});
```

### Before today
```javascript
const form = formBuilder.group({
  date: ['06-05-2018', ExtendedValidators.beforeToday()]
});
```

### After today
```javascript
const form = formBuilder.group({
  date: ['06-05-2018', ExtendedValidators.afterToday()]
});
```

### Number
```javascript
const form = formBuilder.group({
  value: [23, ExtendedValidators.number()]
});
```

### Float
```javascript
const form = formBuilder.group({
  value: [2.4, ExtendedValidators.float()]
});
```

### Boolean
```javascript
const form = formBuilder.group({
  value: [true, ExtendedValidators.boolean()],
  value2: [false, ExtendedValidators.boolean()],
  value3: [1, ExtendedValidators.boolean()],
  value4: [0, ExtendedValidators.boolean()]
});
```

### Dutch phone number
```javascript
const form = formBuilder.group({
  value: ['0509876385', ExtendedValidators.dutchPhone()]
});
```

### Dutch mobile phone number
```javascript
const form = formBuilder.group({
  value: ['0612438764', ExtendedValidators.dutchMobilePhone()]
});
```

### Dutch postal code
```javascript
const form = formBuilder.group({
  value: ['2394 OD', ExtendedValidators.dutchPostalCode()]
});
```

### Dutch IBAN
```javascript
const form = formBuilder.group({
  value: ['NL91ABNA0417164300', ExtendedValidators.iban()]
});
```

### Required if
```javascript
const form = formBuilder.group({
  currentField: ['new value'],
  otherField: ['value']
}, { validators: ExtendedValidators.requiredIf('currentField', 'otherField', 'value', true) });
```

### Required unless
```javascript
const form = formBuilder.group({
  currentField: [''],
  otherField: ['value']
}, { validators: ExtendedValidators.requiredUnless('currentField', 'otherField', 'value', true) });
```

### Required if other field exists
```javascript
const form = formBuilder.group({
  currentField: ['value'],
  otherField: ['value']
}, { validators: ExtendedValidators.requiredIfFieldExists('currentField', 'otherField') });
```

### Required unles other field exists
```javascript
const form = formBuilder.group({
  currentField: [''],
  otherField: ['value']
}, { validators: ExtendedValidators.requiredUnlessFieldExists('currentField', 'otherField') });
```
