const ID_CROSSHAIR = 'crosshair';
const CLASS_CROSSHAIR_COLOR = 'crosshair-color';
const NAMES = [ 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth' ];

const generateRandomId = () => `${Math.random().toString().substr(2, 8)}`;

const insertColorRow = (isDeletable = true) => {
  const crosshairNode = document.getElementById(ID_CROSSHAIR);
  const crosshairColorNodes = [ ...crosshairNode.querySelectorAll('.crosshair-color') ];
  const existingRowsNumber = crosshairColorNodes.length;

  const id = generateRandomId();
  const deleteButton = `<button type="button" class="btn-delete" onclick="removeRow(${id})">🗑</button>`;

  const newCrosshairColorNode = document.createElement('div');
  newCrosshairColorNode.id = id;
  newCrosshairColorNode.className = CLASS_CROSSHAIR_COLOR;
  newCrosshairColorNode.innerHTML = `\
    <input type="color" class="code" value="#000000" />
    ${isDeletable ? deleteButton : ''}
  `;

  crosshairNode.insertBefore(newCrosshairColorNode, crosshairNode.childNodes[ existingRowsNumber ]);
};

const hexToPercentage = (hex) => {
  const base256 = parseInt(hex, 16);
  const base100 = Math.round((base256 / 255) * 100);
  return base100 / 100;
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    red: hexToPercentage(result[ 1 ]),
    green: hexToPercentage(result[ 2 ]),
    blue: hexToPercentage(result[ 3 ]),
  };
};

const colorToScript = (color) => {
  const { name, rgb: { red, green, blue }, next } = color;
  return `set x${name} "seta cg_crosshairrgb ""${red},${green},${blue},1""; set xcolor vstr x${next}"`;
};

const colorsToScript = (indexedColors) => `\
// Toggle cross-hair color
echo "Loading crosshair";

${indexedColors.map((indexedColor) => colorToScript(indexedColor)).join('\n')}
set xcolor "vstr x${indexedColors[ 0 ].name}"
bind * "vstr xcolor"

echo "Loaded crosshair";
`;

window.removeRow = (id) => {
  const row = document.getElementById(id);
  row.parentNode.removeChild(row);
};

window.generateCrosshairScript = () => {
  const crosshairNode = document.getElementById(ID_CROSSHAIR);
  const colorNodes = [ ...crosshairNode.querySelectorAll(`.${CLASS_CROSSHAIR_COLOR}`) ];
  const colors = colorNodes.map((colorNode, index) => {
    const name = NAMES[ index ];
    const hex = colorNode.querySelector('.code').value;
    return { name, rgb: hexToRgb(hex) };
  });

  const indexedColors = colors.map((color, index) => (
    index === colors.length - 1
      ? { ...color, next: colors[ 0 ].name }
      : { ...color, next: colors[ index + 1 ].name }
  ));

  console.log(indexedColors);

  const script = colorsToScript(indexedColors);
  const scriptNode = document.querySelector(`#crosshair-script`);
  scriptNode.removeAttribute('hidden');
  scriptNode.innerHTML = `<code>${script}</code>`;
};

const initCrossHairForm = () => {
  insertColorRow(false);
  insertColorRow(false);
};

initCrossHairForm();
