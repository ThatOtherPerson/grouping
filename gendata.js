var fs = require('fs');

var names = fs.readFileSync('names.dat', 'utf8').replace(/\r/g, '').split('\n');

// number of students in cohort
var n = 40;

// number of students in group
var group_size = 5;

// number of groups
var k = n / group_size;

var costs = [
  1, // Refuse to work with based on technical ability
  1, // Refuse to work with based on intrapersonal issues
  -1 // Would particularly enjoy working with
];

var randomName = function() {
  return names[(names.length * Math.random()) | 0];
}

var randomBool = function(chance) {
  chance = chance || 0.5;
  return Math.random() < chance;
}

// Generates one student's opinion of another student
var randomOpinion = function() {
  // a student has three weights
  var negTech = randomBool(0.2);
  var negIssues = randomBool(0.2);

  var posEnjoy = negTech || negIssues ? false : randomBool();

  return [
    negTech,
    negIssues,
    posEnjoy
  ];
}

var randomStudent = function() {
  var students = [];

  for (var i = 0; i < n; i++) {
    students.push(randomOpinion());
  }

  return {
    name: randomName(),
    opinions: students
  };
}

var students = [];

for (var i = 0; i < n; i++) {
  students.push(randomStudent());
}

console.log(JSON.stringify(students, null, 2));
