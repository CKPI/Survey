const typeValidators = {
  'string': value => typeof value === 'string',
  'number': value => typeof value === 'number',
  'object': value => typeof value === 'object',
  'Date': value =>
    typeof value === 'string' && !Number.isNaN(Date.parse(value)),
};

api.validateType = (typename, value) =>
  typeValidators[typename](value);
