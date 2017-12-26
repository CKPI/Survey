## Collections

### `surveys`

```js
survey = {
  id: 'string',
  questions: [{
    title: 'string',
    type: 'string',
    answers: ['string'], // Optional
    options: {           // Optional
      min: 'number',
      max: 'number',
    },
    info: {              // Optional
      teacher: 'string',
      subject: 'string',
    },
  }],
}
```

### `responses`

```js
responses = {
  surveyId: 'string',
  student: 'id',
  answers: [
    'string',             // For single choice
    'number',             // For single choice
    ['string', 'string'], // For multiple choices
  ],
  completed: 'bool',
}
```

### `students`

```js
student = {
  id: 'string',
  email: 'string',
  password: 'string',
  info: {
    name: {
      first: 'string',
      last: 'string',
      middle: 'string',
    },
    born: 'Date',
    ipn: 'string',
    passport: {
      type: 'string',
      series: 'string',
      number: 'number',
      issued: 'Date',
      department: 'string',
    },
    studentCard: {
      id: 'string',
      series: 'string',
      number: 'number',
      issued: 'Date',
      expires: 'Date',
    },
    faculty: 'string',
    course: 'number',
    group: 'string',
  },
}
```

### `availableSurveys`

```js
availableSurvey = {
  surveyId: 'string',
  studentId: 'string',
}
```
