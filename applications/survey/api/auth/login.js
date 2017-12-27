(credentials, password, callback) => {
  if (typeof credentials !== 'object' || typeof password !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }

  const keys = Object.keys(credentials);

  // validate credentials:
  if (keys.length !== 1) {
    callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
    return;
  }

  const key = keys[0];
  const typename = api.auth.credentialTypes[key];
  if (!typename || !api.validateType(typename, credentials[key])) {
    callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
    return;
  }

  credentials.category = 'students';

  gs.connection.select(credentials).fetch((err, res) => {
    if (err) {
      application.log.error(
        `In auth.login gs.select: ${err}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }

    if (res.length === 0) {
      callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
      return;
    }

    const student = res[0];

    api.auth.verify(password, student.password, (err, ok) => {
      if (err) {
        application.log.error(
          `In auth.login auth.verify: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      if (!ok) {
        callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
        return;
      }

      connection.studentId = student.id;

      callback();
    });
  });
}
