(email, password, callback) => {
  if (typeof email !== 'string' || typeof password !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }
  callback();
}
