api.getFromSchedule = (callback) => {
  const URL_API_TEACHERS = 'https://api.rozklad.org.ua/v2/teachers';
  const ITEMS_PER_PAGE = 100;

  const teachersSubjects = new Map();
  const sequence = [];

  getTeachers(0);

  function getTeachers(offset) {
    const url = new api.url.URL(URL_API_TEACHERS);
    url.search = `?filter={"offset":${offset}}`;

    api.https.get(url, (res) => {
      if (res.statusCode !== 200) {
        application.log.error(
          `In lib schedule getTeachers ${url.href}: ${res.statusMessage}`
        );
        callback(res.statusMessage);
        return;
      }

      const rawData = [];

      res.on('data', (data) => rawData.push(data));
      res.on('end', () => {
        const parsed = JSON.parse(rawData.join(''));
        const teachers = [];

        parsed.data.forEach(
          teacher => teachers.push(teacher.teacher_name)
        );

        const parallel = teachers.reduce((arr, teacher) => {
          arr[0].push((data, callback) => getGroups(teacher, callback));
          return arr;
        }, [[]]);
        sequence.push(parallel);

        offset += ITEMS_PER_PAGE;
        if (teachers.length === ITEMS_PER_PAGE) getTeachers(offset);
        else api.metasync(sequence)({}, () => callback(teachersSubjects));
      });
    });
  }

  function getGroups(teacher, callback) {
    const url = new api.url.URL(URL_API_TEACHERS);
    url.pathname += `/${teacher}/lessons`;

    api.https.get(url, (res) => {
      if (res.statusCode !== 200) {
        application.log.error(
          `In lib schedule getGroups ${url.href}: ${res.statusMessage}`
        );
        callback(null);
        return;
      }

      const rawData = [];

      res.on('data', (data) => rawData.push(data));
      res.on('end', () => {
        const parsed = JSON.parse(rawData.join(''));
        const subjects = new Map();
        addNewGroups(subjects, parsed.data);
        teachersSubjects.set(teacher, subjects);
        callback(null);
      });
    });
  }

  function addNewGroups(subjects, data) {
    data.forEach((lesson) => {
      const subject = lesson.lesson_full_name;
      let groups = subjects.get(subject);

      if (!groups) {
        groups = new Set();
        subjects.set(subject, groups);
      }

      lesson.groups.forEach(
        groupName => groups.add(groupName.group_full_name)
      );
    });
  }
}
