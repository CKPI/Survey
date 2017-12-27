(token, callback) => {
  if (typeof token !== 'string') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }
  callback();
}
