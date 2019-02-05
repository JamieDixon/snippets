const inspect = Symbol.for('nodejs.util.inspect.custom');

const First = x => ({
  x,
  concat: x2 => First(x),
  [inspect]: () => `First(${x})`,
});

const Sum = x => ({
  x,
  concat: ({x: y}) => Sum(x + y),
  [inspect]: () => `Sum(${x})`,
});

const f = First('Hello').concat(First('Foo'));
console.log(f);

const s = Sum(1)
  .concat(Sum(2))
  .concat(Sum(3));
console.log(s);

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
console.log(profileA.concat(profileB));
