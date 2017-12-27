(credentials, callback) => {
  if (typeof credentials !== 'object') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }

  const keys = Object.keys(credentials);

  // validate credentials:
  if (keys.length !== 3) {
    callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
    return;
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const typename = api.auth.credentialTypes[key];
    if (!typename || !api.validateType(typename, credentials[key])) {
      callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
      return;
    }
  }

  credentials.category = 'students';

  gs.connection.select(credentials).fetch((err, res) => {
    if (err) {
      application.log.error(
        `In auth.authenticate gs.select: ${err}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }

    if (res.length === 0) {
      callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
      return;
    }

    const student = res[0];

    connection.authId = student.id;

    callback();
  });
}
