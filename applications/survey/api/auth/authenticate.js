(credentials, callback) => {
  if (typeof credentials !== 'object') {
    callback(api.jstp.ERR_INVALID_SIGNATURE);
    return;
  }
  callback();
}
