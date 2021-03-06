import { addIds } from '../../generic/addIds.js';

import { filterGear } from './filterGear.js';

export const GEAR = addIds({
  BERETTA: {
    name: 'Beretta',
    code: 'F',
    primary: false,
    secondary: false,
    pistol: true,
    nade: false,
    item: false,
  },
  GLOCK: {
    name: 'Glock',
    code: 'f',
    primary: false,
    secondary: false,
    pistol: true,
    nade: false,
    item: false,
  },
  COLT: {
    name: 'Colt 1911',
    code: 'g',
    primary: false,
    secondary: false,
    pistol: true,
    nade: false,
    item: false,
  },
  DESERT_EAGLE: {
    name: 'Desert Eagle',
    code: 'G',
    primary: false,
    secondary: false,
    pistol: true,
    nade: false,
    item: false,
  },
  MAGNUM: {
    name: 'Magnum',
    code: 'l',
    primary: false,
    secondary: false,
    pistol: true,
    nade: false,
    item: false,
  },
  SPAS: {
    name: 'Spas 12',
    code: 'H',
    primary: true,
    secondary: true,
    pistol: false,
    nade: false,
    item: false,
  },
  BENELLI: {
    name: 'Benelli',
    code: 'j',
    primary: true,
    secondary: true,
    pistol: false,
    nade: false,
    item: false,
  },
  MAC: {
    name: 'Mac 11',
    code: 'h',
    primary: true,
    secondary: true,
    pistol: false,
    nade: false,
    item: false,
  },
  MP5: {
    name: 'MP5K',
    code: 'I',
    primary: true,
    secondary: true,
    pistol: false,
    nade: false,
    item: false,
  },
  UMP: {
    name: 'UMP 45',
    code: 'J',
    primary: true,
    secondary: true,
    pistol: false,
    nade: false,
    item: false,
  },
  P90: {
    name: 'P90',
    code: 'k',
    primary: true,
    secondary: true,
    pistol: false,
    nade: false,
    item: false,
  },
  HK: {
    name: 'HK 69',
    code: 'K',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  LR: {
    name: 'LR 3000ML',
    code: 'L',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  M4: {
    name: 'Colt M4',
    code: 'e',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  G36: {
    name: 'G36',
    code: 'M',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  FRF1: {
    name: 'FR-F1',
    code: 'i',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  PSG1: {
    name: 'PSG.1',
    code: 'N',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  SR8: {
    name: 'SR8',
    code: 'Z',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  AK: {
    name: 'AK103',
    code: 'a',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  NEGEV: {
    name: 'Negev LMG',
    code: 'c',
    primary: true,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
  HE: {
    name: 'HE',
    code: 'O',
    primary: false,
    secondary: false,
    pistol: false,
    nade: true,
    item: false,
  },
  SMOKE: {
    name: 'Smoke',
    code: 'Q',
    primary: false,
    secondary: false,
    pistol: false,
    nade: true,
    item: false,
  },
  VEST: {
    name: 'Vest',
    code: 'R',
    primary: false,
    secondary: false,
    pistol: false,
    nade: false,
    item: true,
  },
  GOGGLES: {
    name: 'Tacs',
    code: 'S',
    primary: false,
    secondary: false,
    pistol: false,
    nade: false,
    item: true,
  },
  MEDKIT: {
    name: 'Medkit',
    code: 'T',
    primary: false,
    secondary: false,
    pistol: false,
    nade: false,
    item: true,
  },
  SILENCER: {
    name: 'Silencer',
    code: 'U',
    primary: false,
    secondary: false,
    pistol: false,
    nade: false,
    item: true,
  },
  LASER: {
    name: 'Laser',
    code: 'V',
    primary: false,
    secondary: false,
    pistol: false,
    nade: false,
    item: true,
  },
  HELMET: {
    name: 'Helmet',
    code: 'W',
    primary: false,
    secondary: false,
    pistol: false,
    nade: false,
    item: true,
  },
  AMMO: {
    name: 'Extra ammo',
    code: 'X',
    primary: false,
    secondary: false,
    pistol: false,
    nade: false,
    item: true,
  },
  NONE: {
    name: 'None',
    code: 'A',
    primary: false,
    secondary: false,
    pistol: false,
    nade: false,
    item: false,
  },
});

export const PRIMARY = filterGear(GEAR, 'primary', true);
export const SECONDARY = filterGear(GEAR, 'secondary', true);
export const PISTOL = filterGear(GEAR, 'pistol', false);
export const NADE = filterGear(GEAR, 'nade', true);
export const ITEM = filterGear(GEAR, 'item', true);

export const GEARSETS_KEY_MAPPINGS = {
  1: 'KP_END',
  2: 'KP_DOWNARROW',
  3: 'KP_PGDN',
  4: 'KP_LEFTARROW',
  5: 'KP_5',
  6: 'KP_RIGHTARROW',
  7: 'KP_HOME',
  8: 'KP_UPARROW',
  9: 'KP_PGUP',
};

const DEFAULT_GEAR = {
  name: '',
  primary: GEAR.M4.id,
  secondary: GEAR.P90.id,
  pistol: GEAR.GLOCK.id,
  nade: GEAR.NONE.id,
  item1: GEAR.VEST.id,
  item2: GEAR.HELMET.id,
  item3: GEAR.NONE.id,
};

export const DEFAULT_GEARSETS = {
  type: 'gearsets',
  binds: {
    showMenu: '!',
  },
  gearsets: {
    1: DEFAULT_GEAR,
    2: DEFAULT_GEAR,
    3: DEFAULT_GEAR,
    4: DEFAULT_GEAR,
    5: DEFAULT_GEAR,
    6: DEFAULT_GEAR,
    7: DEFAULT_GEAR,
    8: DEFAULT_GEAR,
    9: DEFAULT_GEAR,
  },
};
