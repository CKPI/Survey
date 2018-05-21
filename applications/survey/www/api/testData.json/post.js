(client, callback) =>  {
  const purgeDB = (data, callback) => {
    const categories =
      ['surveys', 'availableSurveys', 'users', 'responses'];

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
        category: 'users',
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

  const createAdmin = (data, callback) => {
    api.auth.hash(application.config.admin.password, (error, hash) => {
      if (error) {
        application.log.error(
          `In api/testData.json createAdmin hashPassword: ${error}`
        );
        callback(error);
        return;
      }

      const admin = {
        password: hash,
        email: application.config.admin.email,
        admin: true,
        category: 'users',
      };

      gs.connection.create(admin, (error) => {
        if (error) {
          application.log.error(
            `In api/testData.json createAdmin gs.create: ${error}`
          );
          callback(error);
          return;
        }

        callback(null);
      });
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
        if (error) {
          callback({ result: error });
        }

        createAdmin(null, (error) => {
          callback({ result: error || 'ok' });
        });
      });
    });
  });
}
