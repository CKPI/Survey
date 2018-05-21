(token, callback) => {
  if (typeof token !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }

  gs.connection.select({
    verification: token,
    category: 'users',
  }).fetch((err, res) => {
    if (err) {
      application.log.error(
        `In auth.confirmEmail gs.select: ${err}`
      );
      callback(api.jstp.ERR_INTERNAL_API_ERROR);
      return;
    }

    if (res.length === 0) {
      callback(api.auth.errors.ERR_INVALID_TOKEN);
      return;
    }

    const student = res[0];

    delete student.verification;

    delete connection.authId;
    connection.userId = student.id;

    gs.connection.update(student, (err) => {
      if (err) {
        application.log.error(
          `In auth.confirmEmail gs.update: ${err}`
        );
        callback(api.jstp.ERR_INTERNAL_API_ERROR);
        return;
      }
      callback();
    });
  });
}
