(callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  gs.connection.select({
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

    const groups = new Set();
    students.forEach(student => groups.add(student.info.group));

    callback(null, Array.from(groups.values()));
  });
}
