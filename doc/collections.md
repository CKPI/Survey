## Collections

### `surveys`

```js
survey = {
  id: 'number',
  title: 'string',
  created: 'Date',
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
  surveyId: 'number',
  studentId: 'number',
  answers: [
    'string or number or array',
  ],
  completed: 'boolean',
}
```

### `students`

```js
student = {
  id: 'number',
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
  surveyId: 'number',
  studentId: 'number',
}
```
