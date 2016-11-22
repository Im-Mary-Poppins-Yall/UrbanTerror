import {
  h2, a, br, button, code, details, div,
  form, hr, input, label, option, p,
  pre, select, span, summary,
} from '../../../node_modules/skruv/html.js';

import { subscription } from '../../app.js';
import { gearsetsToScript } from './gearsetsToScript.js';
import { GEARSETS_KEY_MAPPINGS, ITEM, NADE, PISTOL, PRIMARY, SECONDARY } from './constants.js';

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

const createBindForm = () => {
  const id = `gearsets-menu-bind`;
  return div(
    { class: 'form-line' },
    label({ for: id }, 'Menu key'),
    input({
      id,
      type: 'text',
      value: subscription.gearsets.formValues.binds.showMenu,
      onchange: ({ target: { value } }) => subscription.gearsets.formValues.binds.showMenu = value,
    }),
  );
};

const onFileUpload = (event) => {
  const { target: { files: [ file ] } } = event;
  const reader = new FileReader();
  reader.addEventListener('load', ({ target: { result } }) => {
    const gearsetsAsString = /^\/\/ IMPORT: (.*)$/m.exec(result)[ 1 ];

    console.log('Imported');

    subscription.gearsets.importError = gearsetsAsString ? '' : 'The file does not contain an importable configuration';
    subscription.gearsets.formValues = JSON.parse(gearsetsAsString);

    console.log(subscription.gearsets.formValues);
  });
  reader.readAsText(file);
};

export default () => (
  details(
    { open: '' },
    summary({}, 'Gearsets'),
    p({}, 'This script maps the 1-9 numpad keys to gearsets for fast in-game switching'),
    p({}, 'Only gearsets with names are mapped, leave the name field blank to leave the key un-assigned'),
    p(
      {},
      'Make sure the gearsets you create are allowed (max number of equipments, no secondary with negev etc...). ' +
      'No checks are done, meaning it is shit-in/shit-out, I can tell you how invalid configurations will behave in-game',
    ),
    p(
      {},
      span(
        {},
        'The generated script must be placed in a file (ex: ',
        code({}, 'q3ut4/gearsets.cfg'),
        ') and loaded from ',
        code({}, 'q3ut4/autoexec.cfg',
        ),
      ),
    ),
    p({}, a({ href: 'https://www.urbanterror.info/support/108-/' }, 'More information about scripting')),
    h2({}, 'Create your gearsets'),
    form({ action: '' },
      () => createBindForm(),
      hr,
      () => createGearsetsForm(),
      button(
        { type: 'button', onclick: generateGearsetsScript },
        'Generate script',
      ),
    ),
    hr,
    h2({}, 'Update your gearsets'),
    p({}, 'You can import a file generated with this application to update it'),
    form(
      { action: '' },
      input({ type: 'file', id: 'file-uploader', onchange: (event) => onFileUpload(event) }, ''),
    ),
    div({ ...(subscription.gearsets.hasGeneratedScript ? {} : { hidden: true }) },
      h2({}, 'Download your new configuration file'),
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
