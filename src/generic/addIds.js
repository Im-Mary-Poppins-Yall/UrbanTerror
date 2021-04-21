export function addIds (map) {
  return Object.entries(map)
    .reduce((seed, [ id, value ]) => {
      seed[ id ] = { id, ...value };
      return seed;
    }, {});
}
