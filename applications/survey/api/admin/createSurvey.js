(title, questions, groups, callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  const survey = {
    title,
    created: new Date(),
    createdBy: connection.userId,
    groups: groups || [],
    category: 'surveys',
  };

  survey.questions = questions || [];

  api.metasync.sequential(
    [
      createSurvey,
      getStuents,
      enableSurvey,
    ],
    {},
    (error) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, survey.id);
    }
  );

  function createSurvey(data, callback) {
    gs.connection.create(survey, (error) => {
      if (error) {
        application.log.error(
          `In admin createSurvey gs.create: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback(null, data);
    });
  }

  function getStuents(data, callback) {
    if (!groups) {
      callback(null, { students: [] });
      return;
    }

    gs.connection.select({
      'info.group': { $in: survey.groups },
      $or: [
        { admin: false },
        { admin: { $exists: false } },
      ],
      category: 'users',
    }).fetch((error, students) => {
      if (error) {
        application.log.error(
          `In admin createSurvey getStuents gs.select: ${error}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback(null, { students });
    });
  }

  function enableSurvey(data, callback) {
    api.metasync.each(data.students, (student, callback) => {
      const availableSurvey = {
        surveyId: survey.id,
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
    }, callback);
  }
}
