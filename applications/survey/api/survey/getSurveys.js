(callback) => {
  if (!connection.userId) {
    callback(api.survey.errors.ERR_MUST_BE_LOGGED_IN);
    return;
  }

  gs.connection.select({
    studentId: connection.userId,
    category: 'availableSurveys',
  }).fetch(processAvailableSurveys);

  function processAvailableSurveys(error, availableSurveys) {
    if (error) {
      application.log.error(
        `In survey getSurveys processAvailableSurveys gs.select: ${error}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }

    if (availableSurveys.length === 0) {
      callback(null, []);
    }

    api.metasync.map(availableSurveys, fetchSurvey, callback);
  }

  function fetchSurvey(availableSurvey, callback) {
    gs.connection.select({
      id: availableSurvey.surveyId,
      category: 'surveys',
    }).fetch((error, [survey]) => {
      if (error) {
        application.log.error(
          `In survey getSurveys fetchSurvey gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      fetchResponses(survey, callback);
    });
  }

  function fetchResponses(survey, callback) {
    gs.connection.select({
      surveyId: survey.id,
      studentId: connection.userId,
      category: 'responses',
    }).fetch((error, [response]) => {
      if (error) {
        application.log.error(
          `In survey getSurveys fetchSurvey gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      const surveyInfo = {
        id: survey.id,
        title: survey.title,
        created: survey.created.toString(),
        completed: false,
      };

      if (response) {
        surveyInfo.completed = response.completed;
      }

      callback(null, surveyInfo);
    });
  }
}
