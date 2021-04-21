import { div, input, label } from '../../node_modules/skruv/html.js';

export function createBindForm (id, labelValue, modelValue, updater) {
  return div(
    { class: 'form-line' },
    label({ for: id }, labelValue),
    input({
      id,
      type: 'text',
      value: modelValue,
      onchange: ({ target: { value } }) => updater(value),
    }),
  );
};
