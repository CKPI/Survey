(surveyId, callback) => {
  if (typeof surveyId !== 'number') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }

  if (!connection.studentId) {
    callback(api.survey.errors.ERR_MUST_BE_LOGGED_IN);
    return;
  }

  api.survey.checkAvailability(connection.studentId, surveyId,
    (error, available) => {
      if (error) {
        application.log.error(
          `In survey getQuestions checkAvailability: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      if (!available) {
        callback(api.survey.errors.ERR_SURVEY_NOT_FOUND);
        return;
      }

      fetchSurvey();
    }
  );

  function fetchSurvey() {
    gs.connection.select({
      id: surveyId,
      category: 'surveys',
    }).fetch((error, [survey]) => {
      if (error) {
        application.log.error(
          `In survey getQuestions gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      if (!survey) {
        callback(api.survey.errors.ERR_SURVEY_NOT_FOUND);
        return;
      }

      fetchResponse(survey);
    });
  }

  function fetchResponse(survey) {
    gs.connection.select({
      surveyId,
      studentId: connection.studentId,
      category: 'responses',
    }).fetch((error, [response]) => {
      if (error) {
        application.log.error(
          `In survey getQuestions gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      let questions = survey.questions;

      if (response) {
        questions = questions.map((question, index) => {
          const submittedAnswer = response.answers[index];
          if (submittedAnswer) {
            question.submittedAnswer = submittedAnswer;
          }
          return question;
        });
      }

      callback(null, questions);
    });
  }
}
