(email, callback) => {
  if (typeof email !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }
  callback();
}
