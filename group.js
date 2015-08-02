var fs = require('fs');

var students = JSON.parse(fs.readFileSync('random.dat', 'utf8'));

// number of students in cohort
var n = students.length;

// number of students in group
var group_size = 5;

// number of groups
var k = n / group_size;

var costs = [
  1, // Refuse to work with based on technical ability
  1, // Refuse to work with based on intrapersonal issues
  -1 // Would particularly enjoy working with
];

var shuffle = function(arr) {
  var i = arr.length - 1;

  while (i > 0) {
    var randIndex = (Math.random() * i) | 0;
    var temp = arr[i];
    arr[i] = arr[randIndex];
    arr[randIndex] = temp;
    //swap(arr, arr[randIndex], arr[i]);
    i--;
  }
}

var randomGrouping = function() {
  var group = [];
  for (var i = 0; i < n; i++) {
    group.push(i);
  }

  shuffle(group);
  return group;
}

var studentCost = function(student, group) {
  var sum = 0;

  if (student.opinions.length !== n) {
    throw new Error('You terrible person');
  }

  for (var i = 0; i < student.opinions.length; i++) {
    for (var j = 0; j < costs.length; j++) {
      if (group[i]) {
        sum += costs[j] * student.opinions[i][j];
      }
    }
  }

  return sum;
}

var cost = function(grouping) {
  var sum = 0;

  if (grouping.length !== n) throw new Error('You terrible person');
  for (var i = 0; i < n; i += group_size) {
    var group = {};
    for (var j = i; j < i + group_size; j++) {
      group[grouping[j]] = true;
    }

    for (var j = i; j < i + group_size; j++) {
      sum += studentCost(students[grouping[j]], group);
    }
  }

  return sum;
}

// genetic algorithm
var pool = [];

/*console.log(randomGrouping().map(function(i) {
  return students[i].name;
}));*/

console.log(cost(randomGrouping()));
