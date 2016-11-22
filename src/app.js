import { body, h1 } from '../node_modules/skruv/html.js';
import { renderNode } from '../node_modules/skruv/vDOM.js';
import { createState } from '../node_modules/skruv/state.js';

import Gearsets from './components/gearsets/index.js';
import { DEFAULT_GEARSETS } from './components/gearsets/constants.js';

export const subscription = createState({
  gearsets: {
    hasGeneratedScript: false,
    formValues: DEFAULT_GEARSETS,
    script: '',
    isCopying: false,
    wasCopied: false,
  },
});

const main = async () => {
  for await (const state of subscription) {
    renderNode(
      body({},
        h1({}, 'Urban Terror scripts generator'),
        Gearsets,
      ),
      document.body,
    );
  }
};

main()
  .catch((error) => console.error(error));
