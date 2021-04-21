import { div, form, input, p } from '../../node_modules/skruv/html.js';

import { subscription } from '../app.js';

export function createFileUploadForm (parentFormName) {
  const id = `${parentFormName}-file-upload`;

  const onFileUpload = (event) => {
    const { target: { files: [ file ] } } = event;
    const reader = new FileReader();
    reader.addEventListener('load', ({ target: { result } }) => {
      const payloadAsString = /^\/\/ IMPORT: (.*)$/m.exec(result)[ 1 ];

      subscription[ parentFormName ].importError = payloadAsString ? '' : 'The file does not contain an importable configuration';
      subscription[ parentFormName ].formValues = JSON.parse(payloadAsString);
    });
    reader.readAsText(file);
  };

  return div({},
    p({}, 'You can import a file generated with this application to update it'),
    form(
      { action: '' },
      input({ type: 'file', id, onchange: (event) => onFileUpload(event) }, ''),
    ),
  );
}
