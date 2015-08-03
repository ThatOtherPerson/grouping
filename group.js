var fs = require('fs');

var students = JSON.parse(fs.readFileSync('random.dat', 'utf8'));

// number of students in cohort
var n = students.length;

// number of students in group
var group_size = 2;

// number of groups
var k = n / group_size;

var weights = [
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
};

var randomGrouping = function() {
  var group = [];
  for (var i = 0; i < n; i++) {
    group.push(i);
  }

  shuffle(group);
  return group;
};

var studentCost = function(student, group) {
  var sum = 0;

  if (student.opinions.length !== n) {
    throw new Error('You terrible person');
  }

  for (var i = 0; i < student.opinions.length; i++) {
    for (var j = 0; j < weights.length; j++) {
      if (group[i]) {
        sum += weights[j] * student.opinions[i][j];
      }
    }
  }

  return sum;
};

var cost = function(grouping) {
  var sum = 0;

  if (grouping.length !== n) throw new Error('You terrible person');
  for (var i = 0; i < n; i += group_size) {
    var inGroup = {};
    for (var j = i; j < i + group_size; j++) {
      inGroup[grouping[j]] = true;
    }

    for (j = i; j < i + group_size; j++) {
      var currentStudent = students[grouping[j]];
      var costOfStudent = studentCost(currentStudent, inGroup);
      sum += costOfStudent;
    }
  }

  return sum;
};

var fitness = function(grouping) {
  // The minimum cost is -group_size * k
  // which would signify a perfect solution
  return 1 / (cost(grouping) + group_size * k);
}

// genetic algorithm
var poolLength = 20;

var crossoverRate = 0.7;
var mutationRate = 0.001;

var pool = [];

for (var i = 0; i < poolLength; i++) {
  pool.push(randomGrouping());
}

/*console.log(randomGrouping().map(function(i) {
  return students[i].name;
}));*/

var roulette = function(values) {
  var total = values.reduce(function(memo, g) {
    return memo + g;
  }, 0);

  var random = Math.random() * total;

  var soFar = 0;
  for (var i = 0; i < values.length; i++) {
    soFar += values[i];

    if (soFar >= random) {
      return i;
    }
  }

  return values.length - 1;
}

// let's just do 10 generations for now
for (var i = 0; i < 10; i++) {
  var newPool = [];

  var fitnesses = [];

  var totalFitness = 0;

  for (var j = 0; j < pool.length; j++) {
    var f = fitness(pool[j]);
    totalFitness += f;
    fitnesses.push(f);
  }

  console.log('Generation', i, 'average fitness:', totalFitness / pool.length);

  while (newPool.length < pool.length) {
    var p1 = roulette(fitnesses);
    var p2 = roulette(fitnesses);

    if (Math.random() < crossoverRate) {
      var child = crossover(p1, p2);
    } else {
      var child = p1;
    }

    if (Math.random() < mutationRate) {
      mutate(child);
    }

    newPool.push(child);
  }

  pool = newPool;
}
