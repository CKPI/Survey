(email, password, callback) => {
  if (typeof email !== 'string' || typeof password !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }
  if (!connection.authId) {
    callback(api.auth.errors.ERR_MUST_BE_AUTHENTICATED);
    return;
  }

  function checkEmailUsage(callback) {
    gs.connection.select({
      email,
      category: 'students',
    }).fetch((err, res) => {
      if (err) {
        application.log.error(
          `In auth.register register: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      if (res.length !== 0 && !res[0].verification) {
        callback(api.auth.errors.ERR_EMAIL_IN_USE);
        return;
      }
      callback();
    });
  }

  checkEmailUsage((err) => {
    if (err) {
      callback(err);
      return;
    }
    gs.connection.select({
      id: connection.authId,
      category: 'students',
    }).fetch((err, res) => {
      if (err) {
        application.log.error(
          `In auth.register register: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      const student = res[0];

      student.email = email;

      hashPassword(student);
    });
  });

  function hashPassword(student) {
    api.auth.hash(password, (err, hash) => {
      if (err) {
        application.log.error(
          `In auth.register hashPassword: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }

      student.password = hash;

      generateVerificationCode(student);
    });
  }

  function generateVerificationCode(student) {
    const code = api.common.generateKey(32, api.common.ALPHA_DIGIT);
    student.verification = code;

    sendEmail(code);
    updateStudent(student);
  }

  function sendEmail(verificationCode) {
    api.mail.sendMail({
      from: application.config.registrationMail.from,
      to: email,
      subject: application.config.registrationMail.subject,
      text: verificationCode,
    }, (err) => {
      if (err) {
        application.log.error(
          `In auth.register sendEmail: ${err}`
        );
      }
    });
  }

  function updateStudent(student) {
    gs.connection.update(student, (err) => {
      if (err) {
        application.log.error(
          `In auth.register updateStudent: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback();
    });
  }
}
