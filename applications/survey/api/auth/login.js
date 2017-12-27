(credentials, password, callback) => {
  if (typeof credentials !== 'object' || typeof password !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }
  callback();
}
