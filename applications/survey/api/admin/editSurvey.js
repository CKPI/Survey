(surveyId, title, groups, callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  let tasks = [];

  if (title || groups) {
    tasks.push(updateSurvey);
  }

  if (groups) {
    tasks = tasks.concat([
      getObsoleteStudents,
      getNewStudents,
      enableSurvey,
      disableSurvay,
      deleteResponses,
    ]);
  }

  api.metasync.sequential(
    tasks,
    {},
    (error) => { callback(error); }
  );

  function updateSurvey(data, callback) {
    gs.connection.select({
      id: surveyId,
      category: 'surveys',
    }).fetch((error, [survey]) => {
      if (error) {
        application.log.error(
          `In admin editSurvey gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      if (title) {
        survey.title = title;
      }

      const newGroups = groups.filter(group => !survey.groups.includes(group));
      const obsoleteGroups =
        survey.groups.filter(group => !groups.includes(group));

      if (groups) {
        survey.groups = groups;
      }

      gs.connection.update(survey, (error) => {
        if (error) {
          application.log.error(
            `In admin editSurvey gs.update: ${error}`
          );
          callback(api.jstp.ERR_INTERNAL_API_ERROR);
          return;
        }

        callback(null, { newGroups, obsoleteGroups });
      });
    });
  }

  function getObsoleteStudents(data, callback) {
    gs.connection.select({
      $or: [
        { admin: false },
        { admin: { $exists: false } },
      ],
      'info.group': { $in: data.obsoleteGroups },
      category: 'users',
    }).fetch((error, students) => {
      if (error) {
        application.log.error(
          `In admin editSurvey getObsoleteStuents gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      data.obsoleteStudents = students;
      callback(null, data);
    });
  }

  function getNewStudents(data, callback) {
    gs.connection.select({
      $or: [
        { admin: false },
        { admin: { $exists: false } },
      ],
      'info.group': { $in: data.newGroups },
      category: 'users',
    }).fetch((error, students) => {
      if (error) {
        application.log.error(
          `In admin editSurvey getNewStuents gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      data.newStudents = students;
      callback(null, data);
    });
  }

  function enableSurvey(data, callback) {
    api.metasync.each(data.newStudents, (student, callback) => {
      const availableSurvey = {
        surveyId,
        studentId: student.id,
        category: 'availableSurveys'
      };

      gs.connection.create(availableSurvey, (error) => {
        if (error) {
          application.log.error(
            `In admin createSurvey enableSurvey gs.create: ${error}`
          );
          callback(api.jstp.ERR_INTERNAL_API_ERROR);
          return;
        }

        callback(null);
      });
    }, (error) => callback(error, data));
  }

  function disableSurvay(data, callback) {
    gs.connection.delete({
      surveyId,
      studentId: { $in: data.obsoleteStudents },
      category: 'availableSurveys',
    }, (error) => {
      if (error) {
        application.log.error(
          `In admin editSurvey disableSurvay gs.delete: ${error}`
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
      studentId: data.obsoleteStudents,
      category: 'responses',
    }, (error) => {
      if (error) {
        application.log.error(
          `In admin editSurvey deleteResponses gs.delete: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback(null, data);
    });
  }
}
