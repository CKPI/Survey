(email, callback) => {
  if (typeof email !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }

  gs.connection.select({
    email,
    category: 'students',
  }).fetch((err, res) => {
    if (err) {
      application.log.error(
        `In auth.restorePassword restorePassword: ${err}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }

    if (res.length === 0) {
      callback(api.auth.errors.ERR_INVALID_CREDENTIALS);
      return;
    }

    generateRestorationCode(res[0]);
  });

  function generateRestorationCode(student) {
    const code = api.common.generateKey(8, api.common.ALPHA_DIGIT);
    student.restoration = code;

    sendEmail(code);
    updateStudent(student);
  }

  function sendEmail(restorationCode) {
    api.mail.sendMail({
      from: application.config.restorationMail.from,
      to: email,
      subject: application.config.restorationMail.subject,
      text: restorationCode,
    }, (err) => {
      if (err) {
        application.log.error(
          `In auth.restorePassword sendEmail: ${err}`
        );
      }
    });
  }

  function updateStudent(student) {
    gs.connection.update(student, (err) => {
      if (err) {
        application.log.error(
          `In auth.restorePassword updateStudent: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback();
    });
  }
}
