(surveyId, callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  api.metasync.sequential(
    [
      deleteSurvey,
      deleteAvailableSurveys,
      deleteResponses,
    ],
    {},
    (error) => {
      callback(error);
    }
  );

  function deleteSurvey(data, callback) {
    gs.connection.delete({
      id: surveyId,
      category: 'surveys',
    }, (error) => {
      if (error) {
        application.log.error(
          `In admin deleteSurvey deleteSurvey gs.delete: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback(null, data);
    });
  }

  function deleteAvailableSurveys(data, callback) {
    gs.connection.delete({
      surveyId,
      category: 'availableSurveys',
    }, (error) => {
      if (error) {
        application.log.error(
          `In admin deleteSurvey deleteAvailableSurveys gs.delete: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback(null, data);
    });
  }

  function deleteResponses(data, callback) {
    gs.connection.delete({
      surveyId,
      category: 'responses',
    }, (error) => {
      if (error) {
        application.log.error(
          `In admin deleteSurvey deleteResponses gs.delete: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback(null, data);
    });
  }
}
