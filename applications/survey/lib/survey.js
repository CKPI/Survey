if (!api.survey) {
  api.survey = {};
}

api.survey.errors = Object.assign(Object.create(null), {
  ERR_MUST_BE_LOGGED_IN: 1025,
  ERR_SURVEY_NOT_FOUND: 1026,
  ERR_QUESTION_NOT_FOUND: 1027,
  ERR_INVALID_ANSWER: 1028,
});
