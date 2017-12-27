api.auth = {};

api.auth.errors = Object.assign(Object.create(null), {
  ERR_INVALID_CREDENTIALS:   1025,
  ERR_MUST_BE_AUTHENTICATED: 1026,
  ERR_INVALID_RESTORE_TOKEN: 1027,
});
