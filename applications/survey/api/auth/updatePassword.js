(token, password, callback) => {
  if (typeof token !== 'string' || typeof password !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }
  callback();
}
