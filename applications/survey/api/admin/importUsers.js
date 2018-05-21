(csv, callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  const students = api.survey.csv.parseCSV(csv);
  const insertStudent = (student, callback) => {
    const entry = {
      info: student,
      category: 'users',
    };
    gs.connection.create(entry, callback);
  };
  api.metasync.each(students, insertStudent, callback);
}
