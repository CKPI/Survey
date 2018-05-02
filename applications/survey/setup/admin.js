api.auth.hash(application.config.admin.password, (error, hash) => {
  if (error) {
    application.log.error(
      `In setup admin hashPassword: ${error}`
    );
    return;
  }

  const admin = {
    password: hash,
    email: application.config.admin.email,
    admin: true,
    category: 'users',
  };

  gs.connection.create(admin, (error) => {
    if (error) {
      application.log.error(
        `In setup admin gs.create: ${error}`
      );
    }
  });
});
