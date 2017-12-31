(surveyId, questionIndex, answer, callback) => {
  if (typeof surveyId !== 'number' || typeof questionIndex !== 'number') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }

  if (!connection.studentId) {
    callback(api.survey.errors.ERR_MUST_BE_LOGGED_IN);
    return;
  }


  gs.connection.select({
    id: surveyId,
    category: 'surveys',
  }).fetch((error, [survey]) => {
    if (error) {
      application.log.error(
        `In survey answer gs.select: ${error}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }

    if (!survey) {
      callback(api.survey.errors.ERR_SURVEY_NOT_FOUND);
      return;
    }

    if (!survey.questions[questionIndex]) {
      callback(api.survey.errors.ERR_QUESTION_NOT_FOUND);
      return;
    }

    const userResponse = {
      surveyId: survey.id,
      studentId: connection.studentId,
      category: 'responses',
    };

    submitResponse(userResponse, survey);
  });

  function submitResponse(userResponse, survey) {
    gs.connection.select(userResponse).fetch((error, [response]) => {
      let submit;
      if (!response) {
        userResponse.answers = new Array(survey.questions.length).fill(null);
        submit = gs.connection.create;
      } else {
        userResponse = response;
        submit = gs.connection.update;
      }

      userResponse.answers[questionIndex] = answer;
      userResponse.completed = userResponse.answers.every(element => !!element);

      submit.call(gs.connection, userResponse, (error) => {
        if (error) {
          application.log.error(
            `In survey answer (gs.create/gs.update): ${error}`
          );
          callback(api.jstp.ERR_INTERNAL_API_ERROR);
          return;
        }

        callback(null);
      });
    });
  }
}
