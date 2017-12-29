(hashMap) => {
  for (const [teacher, subjectInfo] of hashMap) {
    for (const [subject, groups] of subjectInfo) {
      genereateSurvey(teacher, subject, groups);
    }
  }

  function generateSurvey(teacher, subject, groups) {
    const survey = {
      category: 'surveys'
    };

    survey.questions = [
      {
        title: 'Оцените впечатление от предмета.',
        type: 'chooseOne',
        answers: ['1', '2', '3', '4', '5'],
        info: {
          teacher: teacher,
          subject: subject,
        }
      },
      {
        title: 'Оцените компетентность преподавателя.',
        type: 'chooseOne',
        answers: ['1', '2', '3', '4', '5'],
        info: {
          teacher: teacher,
          subject: subject,
        }
      },
      {
        title: 'Оцените требовательность.',
        type: 'chooseOne',
        answers: ['1', '2', '3', '4', '5'],
        info: {
          teacher: teacher,
          subject: subject,
        }
      },
      {
        title: 'Оцените отношение преподавателя к студентам.',
        type: 'chooseOne',
        answers: ['1', '2', '3', '4', '5'],
        info: {
          teacher: teacher,
          subject: subject,
        }
      }
    ];

    gs.connection.create(survey, (error) => {
      if (error) {
        application.log.error(
          `In survey genereator generateSurvey gs.create: ${error}`
        );
        return callback(api.jstp.ERR_INTERNAL_API_ERROR);
      }

      groups.forEach(group => enableSurvey(survey, group));
      callback(null);
    });
  }

  function enableSurvey(survey, group) {
    gs.connection.select({
      info: { group: group },
      category: 'students'
    }).fetch((error, students) => {
      if (error) {
        application.log.error(
          `In survey generator enable gs.select: ${error}`
        );
        return callback(api.jstp.ERR_INTERNAL_API_ERROR);
      }

      students.forEach((student) => {
        const availableSurvey = {
          surveyid: survey.id,
          studentid: student.id
        }

        gs.connection.create(availableSurvey, (error) => {
          if (error) {
            application.log.error(
              `In survey genereator generateSurvey gs.create: ${error}`
            );
            return callback(api.jstp.ERR_INTERNAL_API_ERROR);
          }

          callback(null);
        });
      });
    });
  }
}
