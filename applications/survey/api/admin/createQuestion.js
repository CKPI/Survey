(surveyId, question, callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  api.metasync.sequential(
    [
      addQuestion,
      markAsUncompelted,
    ],
    {},
    (error) => { callback(error); }
  );

  function addQuestion(data, callback) {
    gs.connection.select({
      id: surveyId,
      category: 'surveys',
    }).fetch((error, [survey]) => {
      if (error) {
        application.log.error(
          `In admin createQuestion addQuestion gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      if (!survey) {
        callback(api.admin.errors.ERR_SURVEY_NOT_FOUND);
        return;
      }

      survey.questions.push(question);

      gs.connection.update(survey, (error) => {
        if (error) {
          application.log.error(
            `In admin createQuestion addQuestion gs.update: ${error}`
          );
          callback(api.jstp.ERR_INTERNAL_API_ERROR);
          return;
        }
        callback(null, data);
      });
    });
  }

  function markAsUncompelted(data, callback) {
    gs.connection.select({
      surveyId,
      category: 'responses',
    }).fetch((error, responses) => {
      if (error) {
        application.log.error(
          `In admin createQuestion markAsUncompelted gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      api.metasync.each(responses, (response, callback) => {
        response.completed = false;
        gs.connection.update(response, (error) => {
          if (error) {
            application.log.error(
              `In admin createQuestion markAsUncompelted gs.select: ${error}`
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
