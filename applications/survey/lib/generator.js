api.generateSurveys = (teachersSubjects, callback) => {
  for (const [teacher, subjectInfo] of teachersSubjects) {
    for (const [subject, groups] of subjectInfo) {
      generateSurvey(teacher, subject, groups);
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

      groups.forEach(group => enableSurvey(survey, group));
      callback(null);
    });
  }

  function enableSurvey(survey, group) {
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

      students.forEach((student) => {
        const availableSurvey = {
          surveyId: survey.id,
          studentId: student.id,
          category: 'availableSurveys'
        };

        gs.connection.create(availableSurvey, (error) => {
          if (error) {
            callback(
              `In survey genereator generateSurvey gs.create: ${error}`
            );
            return;
          }

          callback(null);
        });
      });
    });
  }
};
