// Purpose: To explore a way that we might combine 2 user profiles.
// Let's say a single user has created 2 accounts and wishes to merge them

const inspect = Symbol.for('nodejs.util.inspect.custom');

// First semi-group - Pick the first First in the merge and disgard everything else.
const First = x => ({
  x,
  concat: x2 => First(x),
  [inspect]: () => `First(${x})`,
});

// Example First
const f = First('Hello').concat(First('Foo'));
console.log(f); // First('Hello')

// Sum semi-group - return the sum of each Sum semi-group
const Sum = x => ({
  x,
  concat: ({x: y}) => Sum(x + y),
  [inspect]: () => `Sum(${x})`,
});

// Example Sum
const s = Sum(1)
  .concat(Sum(2))
  .concat(Sum(3));
console.log(s); // Sum(6)

// Naive Map implementation
// concat function will attempt to concat each property.
// if a property isn't a semi-group, it will be converted to a First semi-group
const Map = x => ({
  x,
  map: f => Map(f(x)),
  concat: m2 =>
    m2.map(y =>
      Object.entries(y).reduce(
        (agg, [k, v]) => ({
          ...agg,
          [k]: (x[k].concat ? x[k] : First(x[k])).concat(y[k]),
        }),
        {},
      ),
    ),
  // I know, recursive inspect would be nice ¯\_(ツ)_/¯
  [inspect]: () => `Map(${JSON.stringify(x)})`,
});

const profileA = Map({
  name: First('Jamie'),
  rep: Sum(10),
  age: 34,
  interests: ['Coding', 'functional programming'],
});
const profileB = Map({
  name: First('James'),
  rep: Sum(6),
  age: 33,
  interests: ['Physical combat', 'Dancing'],
});

// We assert that if all the elements of a category are semi-groups, the category itself is a semi-group
console.log(profileA.concat(profileB)); // Map({"name":{"x":"Jamie"},"rep":{"x":16},"age":{"x":34},"interests":["Coding","functional programming","Physical combat","Dancing"]})
