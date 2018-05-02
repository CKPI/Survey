(surveyId, callback) => {
  if (typeof surveyId !== 'number') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }

  if (!connection.admin) {
    callback(api.admin.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  gs.connection.select({
    id: surveyId,
    category: 'surveys',
  }).fetch((error, [survey]) => {
    if (error) {
      application.log.error(
        `In admin getQuestions gs.select: ${error}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }

    if (!survey) {
      callback(api.admin.errors.ERR_SURVEY_NOT_FOUND);
      return;
    }

    callback(null, survey.questions);
  });
}
