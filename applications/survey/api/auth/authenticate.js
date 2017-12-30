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
    let ok = false;
    [credentials[key], ok] = api.validateType(typename, credentials[key]);
    if (!typename || !ok) {
      callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
      return;
    }
  }

  const query = api.auth.queryFromCredentials(credentials);

  gs.connection.select(query).fetch((err, res) => {
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

    if (student.email && !student.verification) {
      callback(api.auth.errors.ERR_ALREADY_REGISTERED);
      return;
    }

    connection.authId = student.id;

    callback();
  });
}
