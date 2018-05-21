(token, password, callback) => {
  if (typeof token !== 'string' || typeof password !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }

  gs.connection.select({
    restoration: token,
    category: 'users',
  }).fetch((err, res) => {
    if (err) {
      application.log.error(
        `In auth.updatePassword gs.select: ${err}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }

    if (res.length === 0) {
      callback(api.auth.errors.ERR_INVALID_TOKEN);
      return;
    }

    hashPassword(res[0]);
  });

  function hashPassword(student) {
    api.auth.hash(password, (err, hash) => {
      if (err) {
        application.log.error(
          `In auth.updatePassword hashPassword: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      student.password = hash;

      delete student.restoration;

      updateStudent(student);
    });
  }

  function updateStudent(student) {
    gs.connection.update(student, (err) => {
      if (err) {
        application.log.error(
          `In auth.updatePassword updateStudent: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback();
    });
  }
}
