(client, callback) =>  {
  const purgeDB = (data, callback) => {
    const categories =
      ['surveys', 'availableSurveys', 'students', 'responses'];

    const purgeCategory = (category, callback) => {
      gs.connection.delete({ category }, callback);
    };

    api.metasync.each(categories, purgeCategory, callback);
  };

  const insertStudents = (data, callback) => {
    const students = api.survey.csv.parseCSV(client.data);
    const insertStudent = (student, callback) => {
      const entry = {
        info: student,
        category: 'students',
      };
      gs.connection.create(entry, callback);
    };
    api.metasync.each(students, insertStudent, callback);
  };

  const generateSurveys = (data, callback) => {
    api.getFromSchedule((teacherSubjects) => {
      api.generateSurveys(teacherSubjects, callback);
    });
  };

  purgeDB(null, (error) => {
    if (error) {
      callback({ result: error });
    }

    insertStudents(null, (error) => {
      if (error) {
        callback({ result: error });
      }

      generateSurveys(null, (error) => {
        callback({ result: error || 'ok' });
      });
    });
  });
}
