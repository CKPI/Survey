api.generateSurveys = (teachersSubjects, callback) => {
  api.metasync.each(
    [...teachersSubjects.entries()],
    processTeacher,
    callback
  );

  function processTeacher([teacher, subjectInfo], callback) {
    const processSubject = ([subject, groups], callback) => {
      generateSurvey(teacher, subject, [...groups.values()], callback);
    };

    api.metasync.each(
      [...subjectInfo.entries()],
      processSubject,
      callback
    );
  }

  function generateSurvey(teacher, subject, groups, callback) {
    const survey = {
      title: `Оценка ${teacher} ${subject}`,
      created: new Date(),
      category: 'surveys'
    };

    survey.questions = [
      {
        title: 'Оцените впечатление от предмета.',
        type: 'chooseOne',
        answers: ['1', '2', '3', '4', '5'],
        info: {
          teacher,
          subject,
        }
      },
      {
        title: 'Оцените компетентность преподавателя.',
        type: 'chooseOne',
        answers: ['1', '2', '3', '4', '5'],
        info: {
          teacher,
          subject,
        }
      },
      {
        title: 'Оцените требовательность.',
        type: 'chooseOne',
        answers: ['1', '2', '3', '4', '5'],
        info: {
          teacher,
          subject,
        }
      },
      {
        title: 'Оцените отношение преподавателя к студентам.',
        type: 'chooseOne',
        answers: ['1', '2', '3', '4', '5'],
        info: {
          teacher,
          subject,
        }
      }
    ];

    gs.connection.create(survey, (error) => {
      if (error) {
        callback(
          `In survey genereator generateSurvey gs.create: ${error}`
        );
        return;
      }

      const processGroup = (group, callback) => {
        enableSurvey(survey, group, callback);
      };

      api.metasync.each(groups, processGroup, callback);
    });
  }

  function enableSurvey(survey, group, callback) {
    gs.connection.select({
      'info.group': group,
      category: 'students'
    }).fetch((error, students) => {
      if (error) {
        callback(
          `In survey generator enableSurvey gs.select: ${error}`
        );
        return;
      }

      const processStudent = (student, callback) => {
        const availableSurvey = {
          surveyId: survey.id,
          studentId: student.id,
          category: 'availableSurveys'
        };

        gs.connection.create(availableSurvey, (error) => {
          if (error) {
            callback(
              `In survey genereator enableSurvey gs.create: ${error}`
            );
            return;
          }

          callback(null);
        });
      };

      api.metasync.each(students, processStudent, callback);
    });
  }
};
