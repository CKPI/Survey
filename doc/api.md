## Interface `auth`

### Mehods

| Name | Arguments | Return value | Errors |
|------|-----------|--------------|--------|
| `authenticate` | `credentials` | None | 1025, 1028 |
| `register` | `email, password` | None | 1026, 1029 |
| `confirmEmail` | `token` | None | 1027 |
| `login` | `credentials, password` | None | 1025 |
| `restorePassword` | `email` | None | 1025 |
| `updatePassword` | `token, password` | None | 1027 |

## Errors

| Code | Error |
|------|-------|
| 1025 | `ERR_INVALID_CREDENTIALS` |
| 1026 | `ERR_MUST_BE_AUTHENTICATED` |
| 1027 | `ERR_INVALID_TOKEN` |
| 1028 | `ERR_ALREADY_REGISTERED` |
| 1029 | `ERR_EMAIL_IN_USE` |

## Interface `survey`

### Methods

| Name | Arguments | Return value | Errors |
|------|-----------|--------------|--------|
| `getSurveys` | None | `SurveyInfo[]` | 1025 |
| `getQuestions` | `surveyId` | `Question[]` | 1025, 1026 |
| `answer` | `surveyId, questionIndex, answer` | None | 1025, 1026, 1027, 1028 |

### Errors

| Code | Error |
|------|-------|
| 1025 | `ERR_MUST_BE_LOGGED_IN` |
| 1026 | `ERR_SURVEY_NOT_FOUND` |
| 1027 | `ERR_QUESTION_NOT_FOUND` |
| 1028 | `ERR_INVALID_ANSWER` |

## Data types

### Credentials

`authenticate` expects exactly 3 fields from the following list:

```js
credentials = {
  ipn: 'string',
  passportSeries: 'string',
  passportNumber: 'number',
  passportCreationDate: 'Date string',
  studentCardSeries: 'string',
  studentCardNumber: 'number',
}
```

`login` expects exactly 1 field from the following list:

```js
credentials = {
  ipn: 'string',
  passportSeries: 'string',
  passportNumber: 'number',
  passportCreationDate: 'Date string',
  studentCardSeries: 'string',
  studentCardNumber: 'number',
  email: 'string',
}
```

### SurveyInfo

```js
surveyInfo = {
  id: 'number',
  title: 'string',
  created: 'Date string',
  completed: 'boolean',
}
```

### Question

```js
question = {
  title: 'string',
  type: 'string',
  answers: ['string or number'],                  // Optional
  submittedAnswer: ['string or number or array'], // Optional
  options: {                                      // Optional
    min: 'number',
    max: 'number',
  },
}
```
