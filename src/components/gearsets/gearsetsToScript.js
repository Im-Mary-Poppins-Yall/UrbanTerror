import { SITE_URL } from '../../constants.js';
import { GEAR, GEARSETS_KEY_MAPPINGS } from './constants.js';

const gearsetsToMenuScriptLine = (gearsets) => {
  const gearsetLabels = Object.values(gearsets)
    .filter(({ name }) => !!name)
    .map(({ name }, index) => ` ${index + 1}- ^6${name}^7`);
  return `ut_echo ^7[^4GEAR^7] ${gearsetLabels}`;
};

const toGearsetCode = (gearset) => {
  const pistolCode = GEAR[ gearset.pistol ].code;
  const primaryCode = GEAR[ gearset.primary ].code;
  const secondaryCode = GEAR[ gearset.secondary ].code;
  const nadeCode = GEAR[ gearset.nade ].code;
  const item1Code = GEAR[ gearset.item1 ].code;
  const item2Code = GEAR[ gearset.item2 ].code;
  const item3Code = GEAR[ gearset.item3 ].code;
  return `${pistolCode}${primaryCode}${secondaryCode}${nadeCode}${item1Code}${item2Code}${item3Code}`;
};

const gearsetToScriptLine = (gearset, indexBaseOne) => {
  const { name } = gearset;
  const code = toGearsetCode(gearset);
  const key = GEARSETS_KEY_MAPPINGS[ indexBaseOne ];
  return name
    ? `bind ${key} "gear ${code}; ut_echo Selected ${name}" // Select gear set ${indexBaseOne} with numpad ${indexBaseOne}`
    : `// No name for gearset ${indexBaseOne} => no command mapped`;
};

const gearsetsToScriptLines = (gearsets) => {
  return Object.values(gearsets)
    .map((gearset, index) => gearsetToScriptLine(gearset, index + 1))
    .join('\n');
};

export function gearsetsToScript (subscriptionGearsets) {
  const { binds: { showMenu }, gearsets } = subscriptionGearsets;
  return `\
// Allows selecting 9 pre-defined gearsets with the numpad keys.
// Binds another keys to display the defined gearsets.
// Heavily inspired by a script from iynque
// The import line below allows importing this configuration to ${SITE_URL} to edit it
// IMPORT: ${JSON.stringify(subscriptionGearsets)}

echo "Loading gearsets";

// Use ${showMenu} to show the available options
bind ${showMenu} "${gearsetsToMenuScriptLine(gearsets)};play sound\\misc\\menu2.wav"

////////////
//Gearsets//
////////////
${gearsetsToScriptLines(gearsets)}

echo "Loaded gearsets";
`;
}
