(callback) => {
  if (!connection.admin) {
    callback(api.admin.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  gs.connection.select({
    createdBy: connection.userId,
    category: 'surveys',
  }).fetch((error, surveys) => {
    if (error) {
      application.log.error(
        `In admin getCreatedSurveys gs.select: ${error}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }
    callback(null, surveys);
  });
}
