import { SITE_URL } from '../../constants.js';
import { COLOR_PRESET_NAMES, CROSSHAIR_COLORS, TACS_COLORS, TEAM_COLORS } from './constants.js';

const CYCLE_COMMAND_NAME = 'cycle_color_preset';
const COMMAND_PREFIX = 'color_preset_';

const presetToScriptLine = (preset) => {
  const setEnemiesColor = `set cg_skinEnemy ""${TEAM_COLORS[ preset.enemies ].code}""`;
  const setCrosshairColor = `set cg_crosshairrgb ""${CROSSHAIR_COLORS[ preset.crosshair ].code}""`;
  const setTacsColor = `set cg_nvg ""${TACS_COLORS[ preset.tacs ].code}""`;
  const setNextCommand = `set ${CYCLE_COMMAND_NAME} vstr ${COMMAND_PREFIX}${preset.nextCommandName}`;

  const fullCommand = [
    setEnemiesColor,
    setCrosshairColor,
    setTacsColor,
    setNextCommand,
  ].join('; ');

  return `set ${COMMAND_PREFIX}${preset.commandName} "${fullCommand}"`;
};

const presetsToScriptLines = (presets) => {
  return Object.values(presets)
    .map((preset) => presetToScriptLine(preset))
    .join('\n');
};

export function colorsToScript (subscriptionColorPresets) {
  const { binds: { cycle }, colors } = subscriptionColorPresets;

  const indexedPresets = colors
    .map((preset, index) => (
      index === colors.length - 1
        ? { ...preset, commandName: COLOR_PRESET_NAMES[ index ], nextCommandName: COLOR_PRESET_NAMES[ 0 ] }
        : { ...preset, commandName: COLOR_PRESET_NAMES[ index ], nextCommandName: COLOR_PRESET_NAMES[ index + 1 ] }
    ));

  return `\
// Allows cycling through the color presets with a key-stroke
// The import line below allows importing this configuration to ${SITE_URL} to edit it
// IMPORT: ${JSON.stringify(subscriptionColorPresets)}

echo "Loading colors";

${presetsToScriptLines(indexedPresets)}

set ${CYCLE_COMMAND_NAME} "vstr ${COMMAND_PREFIX}${COLOR_PRESET_NAMES[ 0 ]}"

bind ${cycle} "vstr ${CYCLE_COMMAND_NAME}"

echo "Loaded colors";
`;
}
