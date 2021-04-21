import { a, body, code, h1, h2, p, span } from '../node_modules/skruv/html.js';
import { renderNode } from '../node_modules/skruv/vDOM.js';
import { createState } from '../node_modules/skruv/state.js';

import Gearsets from './components/gearsets/index.js';
import { DEFAULT_GEARSETS } from './components/gearsets/constants.js';

import Colors from './components/colors/index.js';
import { DEFAULT_COLORS } from './components/colors/constants.js';

export const subscription = createState({
  gearsets: {
    hasGeneratedScript: false,
    formValues: DEFAULT_GEARSETS,
    script: '',
    isCopying: false,
    wasCopied: false,
  },
  colors: {
    hasGeneratedScript: false,
    formValues: DEFAULT_COLORS,
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
        h2({}, 'Gearsets'),
        Gearsets,
        h2({}, 'Colors'),
        Colors,
        p(
          {},
          span(
            {},
            'The generated scripts must be placed in a file (ex: ',
            code({}, 'q3ut4/client_colors.cfg'),
            ') and loaded from ',
            code({}, 'q3ut4/autoexec.cfg',
            ),
          ),
        ),
        p({}, a({ href: 'https://www.urbanterror.info/support/108-/' }, 'More information about scripting')),
      ),
      document.body,
    );
  }
};

main()
  .catch((error) => console.error(error));
