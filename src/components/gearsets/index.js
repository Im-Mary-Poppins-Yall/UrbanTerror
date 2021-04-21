import {
  h3, a, br, button, code, details, div,
  form, hr, input, label, option, p,
  pre, select, summary,
} from '../../../node_modules/skruv/html.js';

import { subscription } from '../../app.js';
import { createBindForm } from '../../generic/createBindForm.js';

import { gearsetsToScript } from './gearsetsToScript.js';
import { GEARSETS_KEY_MAPPINGS, ITEM, NADE, PISTOL, PRIMARY, SECONDARY } from './constants.js';
import { createFileUploadForm } from '../../generic/createFileUploadForm.js';

const createGearSelect = (indexBaseOne, category, options, gearset) => {
  const value = gearset[ category ];
  const optionNodes = Object.values(options)
    .map(({ name, id }) => (
      id === value
        ? option({ value: id, selected: 'selected' }, name)
        : option({ value: id }, name)
    ));
  const id = `gearset-${indexBaseOne}-${category}-select`;

  return div(
    { class: 'form-field' },
    label({ for: id }, category),
    select(
      { id, class: category, onchange: ({ target }) => gearset[ category ] = target.value },
      ...optionNodes,
    ),
  );
};

const generateGearsetsScript = () => {
  subscription.gearsets.script = gearsetsToScript(subscription.gearsets.formValues);
  subscription.gearsets.hasGeneratedScript = true;
};

const createGearsetsForm = () => {
  const gearsetsDivs = Object.keys(GEARSETS_KEY_MAPPINGS)
    .map((indexBaseOne) => {
      const gearset = subscription.gearsets.formValues.gearsets[ indexBaseOne ];
      const nameInputId = `gearset-${indexBaseOne}-name`;
      return div(
        { class: `gearset-${indexBaseOne}` },
        div(
          { class: 'form-line' },
          label({ for: nameInputId }, `Gearset N°${indexBaseOne} name`),
          input({
            id: nameInputId,
            type: 'text',
            value: subscription.gearsets.formValues.gearsets[ indexBaseOne ].name,
            oninput: ({ target: { value } }) => gearset.name = value,
          }, ''),
        ),
        br,
        div(
          { class: 'form-line' },
          createGearSelect(indexBaseOne, 'primary', PRIMARY, gearset),
          createGearSelect(indexBaseOne, 'secondary', SECONDARY, gearset),
          createGearSelect(indexBaseOne, 'pistol', PISTOL, gearset),
        ),
        br,
        div(
          { class: 'form-line' },
          createGearSelect(indexBaseOne, 'nade', NADE, gearset),
          createGearSelect(indexBaseOne, 'item1', ITEM, gearset),
          createGearSelect(indexBaseOne, 'item2', ITEM, gearset),
          createGearSelect(indexBaseOne, 'item3', ITEM, gearset),
        ),
        hr,
      );
    });

  return div({ id: 'gearsets' }, ...gearsetsDivs);
};

export default () => (
  details(
    {},
    summary({}, 'One-key gearsets update'),
    p({}, 'This script maps the 1-9 numpad keys to gearsets for fast in-game switching'),
    p({}, 'Only gearsets with names are mapped, leave the name field blank to leave the key un-assigned'),
    p(
      {},
      'Make sure the gearsets you create are allowed (max number of equipments, no secondary with negev etc...). ' +
      'No checks are done, meaning it is shit-in/shit-out, I can tell you how invalid configurations will behave in-game',
    ),
    h3({}, 'Create your gearsets'),
    form({ action: '' },
      () => createBindForm(
        'gearsets-menu-bind',
        'Menu key',
        subscription.gearsets.formValues.binds.showMenu,
        (value) => subscription.gearsets.formValues.binds.showMenu = value,
      ),
      hr,
      () => createGearsetsForm(),
      button(
        { type: 'button', onclick: generateGearsetsScript },
        'Generate script',
      ),
    ),
    hr,
    h3({}, 'Update your gearsets'),
    createFileUploadForm('gearsets'),
    div({ ...(subscription.gearsets.hasGeneratedScript ? {} : { hidden: true }) },
      h3({}, 'Download your new configuration file'),
      pre(
        { id: 'gearsets-script' },
        code({}, subscription.gearsets.script),
      ),
      button(
        {
          disabled: subscription.gearsets.isCopying,
          onclick: async () => {
            subscription.gearsets.isCopying = true;
            await navigator.clipboard.writeText(subscription.gearsets.script);
            setTimeout(() => {
              subscription.gearsets.isCopying = false;
              subscription.gearsets.wasCopied = true;
            }, 500);
          },
        },
        subscription.gearsets.isCopying ? 'Copying script...' : `Copy script ${subscription.gearsets.wasCopied ? '✔' : ''}`,
      ),
      a(
        {
          href: URL.createObjectURL(new Blob([ subscription.gearsets.script ], { type: 'text/plain' })),
          download: 'client_gearsets.cfg',
        },
        'Download script file',
      ),
    ),
  )
);
