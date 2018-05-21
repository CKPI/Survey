(surveyId, index, question, callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  api.metasync.sequential(
    [
      updateQuestions,
      updateResponses,
    ],
    {},
    (error) => { callback(error); }
  );

  function updateQuestions(data, callback) {
    gs.connection.select({
      id: surveyId,
      category: 'surveys',
    }).fetch((error, [survey]) => {
      if (error) {
        application.log.error(
          `In admin editQuestion updateQuestions gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      if (!survey) {
        callback(api.admin.errors.ERR_SURVEY_NOT_FOUND);
        return;
      }

      if (survey.questions.length <= index) {
        callback(api.admin.errors.ERR_QUESTION_NOT_FOUND);
        return;
      }

      survey.questions[index] = question;

      gs.connection.update(survey, (error) => {
        if (error) {
          application.log.error(
            `In admin editQuestion updateQuestions gs.update: ${error}`
          );
          callback(api.jstp.ERR_INTERNAL_API_ERROR);
          return;
        }
        callback(null, data);
      });
    });
  }

  function updateResponses(data, callback) {
    gs.connection.select({
      surveyId,
      category: 'responses',
    }).fetch((error, responses) => {
      if (error) {
        application.log.error(
          `In admin editQuestion updateResponses gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      api.metasync.each(responses, (response, callback) => {
        response.answers[index] = null;
        response.completed = false;
        gs.connection.update(response, (error) => {
          if (error) {
            application.log.error(
              `In admin editQuestion updateResponses gs.select: ${error}`
            );
            callback(api.jstp.ERR_INTERNAL_API_ERROR);
            return;
          }

          callback(null);
        });
      }, callback);
    });
  }
}
