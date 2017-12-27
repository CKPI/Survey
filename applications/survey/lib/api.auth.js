api.auth = {};

api.auth.errors = Object.assign(Object.create(null), {
  ERR_INVALID_CREDENTIALS:   1025,
  ERR_MUST_BE_AUTHENTICATED: 1026,
  ERR_INVALID_RESTORE_TOKEN: 1027,
});

api.auth.config = {
  saltRounds: 10,
};

api.auth.hash = (password, callback) => {
  api.bcrypt.genSalt(api.auth.config.saltRounds, (err, salt) => {
    if (err) {
      callback(err);
      return;
    }

    api.bcrypt.hash(password, salt, (err, password) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, password);
    });
  });
};

api.auth.verify = (password, hashed, callback) =>
  api.bcrypt.compare(password, hashed, callback);

api.auth.credentialTypes = {
  ipn: 'string',
  passportSeries: 'string',
  passportNumber: 'number',
  passportCreationDate: 'Date',
  studentCardSeries: 'string',
  studentCardNumber: 'number',
};
