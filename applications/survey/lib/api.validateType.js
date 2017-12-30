const typeValidators = {
  string: value => [value, typeof value === 'string'],
  number: value => [value, typeof value === 'number'],
  object: value => [value, typeof value === 'object'],
  Date: value => [
    new Date(value),
    typeof value === 'string' && !Number.isNaN(Date.parse(value)),
  ],
};

api.validateType = (typename, value) =>
  typeof typename === 'string' && typeValidators[typename](value);
