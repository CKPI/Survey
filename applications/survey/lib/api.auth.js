api.auth = {};

api.auth.errors = Object.assign(Object.create(null), {
  ERR_INVALID_CREDENTIALS:   1025,
  ERR_MUST_BE_AUTHENTICATED: 1026,
  ERR_INVALID_TOKEN:         1027,
  ERR_ALREADY_REGISTERED:    1028,
  ERR_EMAIL_IN_USE:          1029,
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

api.auth.credentialAliases = {
  email: 'email',
  ipn: 'info.ipn',
  passportSeries: 'info.passport.series',
  passportNumber: 'info.passport.number',
  passportCreationDate: 'info.passport.issued',
  studentCardSeries: 'info.studentCard.series',
  studentCardNumber: 'info.studentCard.number',
};

api.auth.credentialAliasesKeys = Object.keys(api.auth.credentialAliases);

api.auth.queryFromCredentials = (credentials) => {
  const query = {
    category: 'users',
  };
  api.auth.credentialAliasesKeys.forEach((key) => {
    const queryKey = api.auth.credentialAliases[key];
    if (credentials[key]) {
      query[queryKey] = credentials[key];
    }
  });
  return query;
};
