(surveyId, index, callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  api.metasync.sequential(
    [
      deleteQuestions,
      deleteResponses,
    ],
    {},
    (error) => { callback(error); }
  );

  function deleteQuestions(data, callback) {
    gs.connection.select({
      id: surveyId,
      category: 'surveys',
    }).fetch((error, [survey]) => {
      if (error) {
        application.log.error(
          `In admin deleteQuestion deleteQuestions gs.select: ${error}`
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

      survey.questions.splice(index, 1);

      gs.connection.update(survey, (error) => {
        if (error) {
          application.log.error(
            `In admin deleteQuestion deleteQuestions gs.update: ${error}`
          );
          callback(api.jstp.ERR_INTERNAL_API_ERROR);
          return;
        }
        callback(null, data);
      });
    });
  }

  function deleteResponses(data, callback) {
    gs.connection.select({
      surveyId,
      category: 'responses',
    }).fetch((error, responses) => {
      if (error) {
        application.log.error(
          `In admin deleteQuestion deleteResponses gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      api.metasync.each(responses, (response, callback) => {
        response.answers.splice(index, 1);
        gs.connection.update(response, (error) => {
          if (error) {
            application.log.error(
              `In admin deleteQuestion deleteResponses gs.select: ${error}`
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
