if (!global.api) {
  global.api = {};
  module.exports = api;
}

if (!api.survey) {
  api.survey = {};
}

api.survey.csv = {};

const transformations = {
  string: entry => entry,
  number: entry => +entry,
  date: entry => new Date(entry),
};

const typify = (field) => ({
  name: field[0],
  type: field[1] || 'string'
});

const fields = [
  ['firstName'],
  ['lastName'],
  ['middleName'],
  ['born', 'date'],
  ['ipn'],
  ['documentType'],
  ['passportSeries'],
  ['passportNumber', 'number'],
  ['passportDate', 'date'],
  ['passportDepartment'],
  ['studentCardId'],
  ['studentCardSeries'],
  ['studentCardNumber', 'number'],
  ['studentCardCreationDate', 'date'],
  ['studentCardEolDate', 'date'],
  ['faculty'],
  ['courseId', 'number'],
  ['group'],
].map(typify);

const structurizeStudent = (student) => ({
  name: {
    first: student.firstName,
    last: student.lastName,
    middle: student.middleName,
  },
  born: student.born,
  ipn: student.ipn,
  passport: {
    type: student.documentType,
    series: student.passportSeries,
    number: student.passportNumber,
    issued: student.passportDate,
    department: student.passportDepartment,
  },
  studentCard: {
    id: student.studentCardId,
    series: student.studentCardSeries,
    number: student.studentCardNumber,
    issued: student.studentCardCreationDate,
    expires: student.studentCardEolDate,
  },
  faculty: student.faculty,
  course: student.courseId,
  group: student.group,
});

api.survey.csv.parseLine = (line) => {
  const entries = line.split(',').map(entry => entry.trim());
  const student = {};
  fields.forEach((field, index) => {
    const transformation = transformations[field.type];
    const entry = entries[index];
    student[field.name] = transformation(entry);
    if (field.type === 'number' && isNaN(student[field.name]))
      throw new Error('Incorrect number when parsing data');
    if (field.type === 'date' && isNaN(student[field.name]))
      throw new Error('Incorrect date when parsing data');
  });
  return structurizeStudent(student);
};

api.survey.csv.parseCSV = (text) => {
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.map(api.survey.csv.parseLine);
};
