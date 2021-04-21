import { addIds } from '../../generic/addIds.js';

export const TEAM_COLORS = addIds({
  DEFAULT: { code: 0, name: 'Default' },
  GREEN: { code: 1, name: 'Green' },
  RED: { code: 2, name: 'Red' },
  BLUE: { code: 3, name: 'Blue' },
  PURPLE: { code: 4, name: 'Purple' },
  ORANGE: { code: 5, name: 'Orange' },
  OLIVE: { code: 6, name: 'Olive' },
  WHITE: { code: 7, name: 'White' },
  BLACK: { code: 8, name: 'Black' },
  DESERT: { code: 9, name: 'Desert' },
  COWBOY: { code: 10, name: 'Cowboy' },
  CAVALRY: { code: 11, name: 'Cavalry' },
  DROOGS: { code: 12, name: 'Droogs' },
  DR_PINK: { code: 13, name: 'Dr. Pink' },
  DR_BLUE: { code: 14, name: 'Dr. Blue' },
});

export const CROSSHAIR_COLORS = addIds({
  BLACK: { code: '0,0,0,1', name: 'Black' },
  WHITE: { code: '1,1,1,1', name: 'White' },
  GREEN: { code: '0,1,0,1', name: 'Green' },
  RED: { code: '1,0,0,1', name: 'Red' },
  BLUE: { code: '0,0,1,1', name: 'Blue' },
  YELLOW: { code: '1,1,0,1', name: 'Yellow' },
  CYAN: { code: '0,1,1,1', name: 'Cyan' },
  MAGENTA: { code: '1,0,.5,1', name: 'Magenta' },
  PINK: { code: '1,0,1,1', name: 'Pink' },
  ORANGE: { code: '1,.5,0,1', name: 'Orange' },
});

export const TACS_COLORS = addIds({
  GREEN: { code: 0, name: 'Green' },
  RED: { code: 1, name: 'Red' },
  BLUE: { code: 2, name: 'Blue' },
  YELLOW: { code: 3, name: 'Yellow' },
  CYAN: { code: 4, name: 'Cyan' },
  MAGENTA: { code: 5, name: 'Magenta' },
  PINK: { code: 6, name: 'Pink' },
  ORANGE: { code: 7, name: 'Orange' },
});

export const DEFAULT_COLOR_PRESET = {
  enemies: TEAM_COLORS.DR_PINK.id,
  crosshair: CROSSHAIR_COLORS.BLACK.id,
  tacs: TACS_COLORS.GREEN.id,
};

export const DEFAULT_COLORS = {
  type: 'colors',
  binds: {
    cycle: '*',
  },
  colors: [
    DEFAULT_COLOR_PRESET,
  ],
};

export const COLOR_PRESET_NAMES = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
];
