import { GEAR } from './constants.js';

export function filterGear (gear, field, allowsNone) {
  return Object.entries(gear)
    .filter(([ name, value ]) => (
      allowsNone
        ? name === GEAR.NONE.id || value[ field ]
        : value[ field ]
    ))
    .reduce(
      (seed, [ name, value ]) => {
        seed[ name ] = value;
        return seed;
      },
      {},
    );
}
