const express = require('express');
const cors = require('cors');

const data = {
  courses: require('./models/courses.json'),
  setCourses: function (data) {
    this.courses = data;
  },
};

const fsPromises = require('fs').promises;

const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/courses', (req, res) => {
  res.json(data.courses);
});
// ---------

app.post('/api/courses', async (req, res) => {
  const {
    name,
    surname,
    email,
    mobile,
    region,
    courses,
    oneperson,
    members,
    days,
    isBelarusian,
    privacy,
    privacy2,
  } = req.body;

  const newCourse = {
    id: data.courses.length ? data.courses[data.courses.length - 1].id + 1 : 1,
    name,
    surname,
    email,
    mobile,
    region,
    courses,
    oneperson,
    members,
    days,
    isBelarusian,
    privacy,
    privacy2,
  };

  data.setCourses([...data.courses, newCourse]);
  await fsPromises.writeFile(
    path.join(__dirname, 'models', 'courses.json'),
    JSON.stringify(data.courses)
  );
  res.status(201).json(newCourse);
});

app.put('/api/courses/:id', async (req, res) => {
  const course = data.courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  if (!course) {
    return res
      .status(400)
      .json({ message: `Course ID ${req.params.id} not found` });
  }
  if (req.body.name) course.name = req.body.name;
  if (req.body.surname) course.surname = req.body.surname;
  if (req.body.email) course.email = req.body.email;
  if (req.body.mobile) course.mobile = req.body.mobile;
  if (req.body.region) course.region = req.body.region;
  if (req.body.courses) course.courses = req.body.courses;
  const filteredArray = data.courses.filter(
    (course) => course.id !== parseInt(req.params.id)
  );
  const unsortedArray = [...filteredArray, course];
  data.setCourses(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  await fsPromises.writeFile(
    path.join(__dirname, 'models', 'courses.json'),
    JSON.stringify(data.courses)
  );
  res.json(course);
});

// ------------

app.get('/api/courses/:id', (req, res) => {
  const foundCourse = data.courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  if (!foundCourse) {
    return res
      .status(400)
      .json({ message: `Course with ID ${req.params.id} not found` });
  }
  res.json(foundCourse);
});

app.listen(5000, console.log('server is running'));
