(locale, callback) => {
  const {
    requiredAmountOfQuestions,
    darkMode
  } = application.config.client;
  callback(null, {
    darkMode,
    requiredAmountOfQuestions,
    acceptableQuestions: api.auth.credentialTypes,
    localization: application.config.client.localization[locale],
  });
}
