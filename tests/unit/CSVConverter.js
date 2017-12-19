'use strict';

const test = require('tap').test;

const fs = require('fs');

const api = require('../../applications/Survey/lib/CSVConverter.js');

const parseSingleExample = {
  name: {
    first: 'Іванов',
    last: 'Іван',
    middle: 'Іванович'
  },
  born: new Date('1/1/1990'),
  ipn: 2221112211,
  passport: {
    type: '1',
    series: 'СС',
    number: 222222,
    issued: new Date('1/1/2000'),
    department: 'Київським МВ УМВС'
  },
  studentCard: {
    id: '101',
    series: 'КВ',
    number: 642222444,
    issued: new Date('9/1/2009'),
    expires: new Date('6/30/2013')
  },
  faculty: 'Факультет інформатики та обчислювальної техніки',
  course: 1,
  group: 'ІТ-71'
};

const parseMultipleExample = [ {
  name: {
    first: 'Іванов',
    last: 'Іван',
    middle: 'Іванович'
  },
  born: new Date('1/1/1990'),
  ipn: 2221112211,
  passport: {
    type: '1',
    series: 'СС',
    number: 222222,
    issued: new Date('1/1/2000'),
    department: 'Київським МВ УМВС'
  },
  studentCard: {
    id: '101',
    series: 'КВ',
    number: 642222444,
    issued: new Date('9/1/2009'),
    expires: new Date('6/30/2013')
  },
  faculty: 'Факультет інформатики та обчислювальної техніки',
  course: 1,
  group: 'ІТ-71'
},
{
  name: {
    first: 'Петров',
    last: 'Петро',
    middle: 'Петрович'
  },
  born: new Date('2/2/1991'),
  ipn: 3332223322,
  passport: {
    type: '2',
    series: 'АА',
    number: 333333,
    issued: new Date('2/2/2001'),
    department: 'Київським МВ УМВС'
  },
  studentCard: {
    id: '303',
    series: 'КТ',
    number: 751111333,
    issued: new Date('10/2/2010'),
    expires: new Date('7/20/2014')
  },
  faculty: 'Факультет інформатики та обчислювальної техніки',
  course: 2,
  group: 'ІТ-61'
} ];

test('parseLine', (test) => {
  fs.readFile('./tests/unit/example.csv', 'utf8', (err, data) => {
    if (!err) {
      const result = api.survey.csv.parseLine(data.split('\n')[0]);
      test.strictSame(result, parseSingleExample);
    } else {
      console.error('error occured during attemp to test module: ' + err);
    }
    test.end();
  });
});

test('parseCSV', (test) => {
  fs.readFile('./tests/unit/example.csv', 'utf8', (err, data) => {
    if (!err) {
      const result = api.survey.csv.parseCSV(data);
      test.strictSame(result, parseMultipleExample);
    } else {
      console.error('error occured during attemp to test module: ' + err);
    }
    test.end();
  });
});
