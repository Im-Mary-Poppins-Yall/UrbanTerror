import {
  h3, a, br, button, code, details, div,
  form, hr, input, label, option, p,
  pre, select, span, summary,
} from '../../../node_modules/skruv/html.js';

import { subscription } from '../../app.js';
import { createBindForm } from '../../generic/createBindForm.js';

import { colorsToScript } from './colorsToScript.js';
import { createFileUploadForm } from '../../generic/createFileUploadForm.js';
import {
  DEFAULT_COLOR_PRESET, TEAM_COLORS, TACS_COLORS, CROSSHAIR_COLORS,
} from './constants.js';

const createColorSelect = (indexBaseOne, category, options, colorPreset) => {
  const value = colorPreset[ category ];
  const optionNodes = Object.values(options)
    .map(({ name, id }) => (
      id === value
        ? option({ value: id, selected: 'selected' }, name)
        : option({ value: id }, name)
    ));
  const id = `color-${indexBaseOne}-${category}-select`;

  return div(
    { class: 'form-field' },
    label({ for: id }, category),
    select(
      { id, class: category, onchange: ({ target }) => colorPreset[ category ] = target.value },
      ...optionNodes,
    ),
  );
};

const createColorSetForm = (colorSet, index) => {
  const indexBaseOne = index + 1;
  return div(
    { class: `color-${indexBaseOne}` },
    p({}, `Preset ${indexBaseOne}`),
    div({ class: 'form-line' },
      createColorSelect(indexBaseOne, 'enemies', TEAM_COLORS, colorSet),
      createColorSelect(indexBaseOne, 'crosshair', CROSSHAIR_COLORS, colorSet),
      createColorSelect(indexBaseOne, 'tacs', TACS_COLORS, colorSet),
      div(
        { class: 'form-field', ...(index === 0 ? { hidden: true } : {}) },
        span({ class: 'placeholder', 'aria-hidden': '' }),
        button(
          { type: 'button', onclick: () => subscription.colors.formValues.colors.splice(index, 1) },
          `🗑 Remove preset ${indexBaseOne}`,
        ),
      ),
    ),
    hr,
  );
};

const createColorsForm = () => {
  const colorSetForms = subscription.colors.formValues.colors
    .map((colorSet, index) => createColorSetForm(colorSet, index));

  return div(
    { id: 'colors' },
    ...colorSetForms,
    div(
      { class: 'submit-line' },
      button(
        { type: 'button', onclick: () => subscription.colors.formValues.colors.push(DEFAULT_COLOR_PRESET) },
        '➕ Add preset',
      ),
    ),
  );
};

const generateColorsScript = () => {
  subscription.colors.script = colorsToScript(subscription.colors.formValues);
  subscription.colors.hasGeneratedScript = true;
};

export default () => (
  details(
    {},
    summary({}, 'One-key enemy/cross-hair/tacs color update'),
    p({}, 'This script allows you to update the enemy, cross-hair, and tacs colors from presets with a single key-press'),
    h3({}, 'Create your gearsets'),
    form({ action: '' },
      () => createBindForm(
        'colors-action-bind',
        'Cycle color key',
        subscription.colors.formValues.binds.cycle,
        (value) => subscription.colors.formValues.binds.cycle = value,
      ),
      hr,
      () => createColorsForm(),
      button(
        { type: 'button', onclick: generateColorsScript },
        'Generate script',
      ),
    ),
    hr,
    h3({}, 'Update your color presets'),
    createFileUploadForm('colors'),
    div({ ...(subscription.colors.hasGeneratedScript ? {} : { hidden: true }) },
      h3({}, 'Download your new configuration file'),
      pre(
        { id: 'colors-script' },
        code({}, subscription.colors.script),
      ),
      button(
        {
          disabled: subscription.colors.isCopying,
          onclick: async () => {
            subscription.colors.isCopying = true;
            await navigator.clipboard.writeText(subscription.colors.script);
            setTimeout(() => {
              subscription.colors.isCopying = false;
              subscription.colors.wasCopied = true;
            }, 200 /* TODO: extract */);
          },
        },
        subscription.colors.isCopying ? 'Copying script...' : `Copy script ${subscription.colors.wasCopied ? '✔' : ''}`,
      ),
      a(
        {
          href: URL.createObjectURL(new Blob([ subscription.colors.script ], { type: 'text/plain' })),
          download: 'client_colors.cfg',
        },
        'Download script file',
      ),
    ),
  )
);
