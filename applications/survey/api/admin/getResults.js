(surveyId, callback) => {
  if (!connection.admin) {
    callback(api.adim.errors.ERR_NOT_AUTHORIZED);
    return;
  }

  gs.connection.select({
    surveyId,
    category: 'responses',
  }).fetch((error, responses) => {
    if (responses.length === 0) {
      callback(null, []);
      return;
    }

    const answers = [];
    for (let i = 0; i < responses[0].answers.length; i++) {
      answers.push(new Map());
    }

    responses.forEach(response => {
      response.answers.forEach((answer, index) => {
        const counter = answers[index].get(answer);

        if (!counter) {
          answers[index].set(answer, 1);
        } else {
          answers[index].set(answer, counter + 1);
        }
      });
    });

    callback(null, answers.map(variants => Array.from(variants.entries())));
  });
}
