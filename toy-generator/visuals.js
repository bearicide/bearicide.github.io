(() => {
  'use strict';

  const pitch = document.querySelector('.toy-pitch');
  const toyName = document.querySelector('#toy-name');
  const resultTags = document.querySelector('#result-tags');
  const toyParts = document.querySelector('#toy-parts');

  if (!pitch || !toyName || !resultTags) return;

  const panel = document.createElement('section');
  panel.className = 'concept-visual';
  panel.setAttribute('aria-labelledby', 'visual-sketch-title');
  panel.innerHTML = `
    <div class="visual-toolbar">
      <div>
        <p class="visual-kicker">LIVE CONCEPT SKETCH</p>
        <h3 id="visual-sketch-title">What might it look like?</h3>
      </div>
      <div class="visual-buttons">
        <button class="visual-button" id="remix-visual" type="button">Remix look</button>
        <button class="visual-button" id="save-visual" type="button">Save sketch SVG</button>
      </div>
    </div>
    <div class="visual-stage">
      <svg class="toy-sketch" id="toy-sketch" viewBox="0 0 720 420" role="img" aria-labelledby="toy-sketch-title toy-sketch-desc" xmlns="http://www.w3.org/2000/svg">
        <title id="toy-sketch-title">Generated toy concept sketch</title>
        <desc id="toy-sketch-desc">A simple visual concept showing the toy silhouette, controls, and key parts.</desc>
      </svg>
    </div>
    <div class="visual-meta">
      <p class="visual-caption" id="visual-caption"><strong>Concept view:</strong> generated from the toy family and vibe.</p>
      <div class="visual-palette" id="visual-palette" aria-label="Generated color palette"></div>
    </div>`;

  pitch.insertAdjacentElement('afterend', panel);

  const svg = panel.querySelector('#toy-sketch');
  const caption = panel.querySelector('#visual-caption');
  const paletteBox = panel.querySelector('#visual-palette');
  const remixButton = panel.querySelector('#remix-visual');
  const saveButton = panel.querySelector('#save-visual');

  let remix = 0;

  const palettes = {
    cozy: ['#ffd45a', '#ff9dbb', '#8ee0d0', '#fff8e8'],
    weird: ['#a98bff', '#ff9c5a', '#6fe1e8', '#f6f06b'],
    spooky: ['#7b68ee', '#9be36f', '#ff78b7', '#292039'],
    gross: ['#9be36f', '#ffd45a', '#ff9c5a', '#6fe1e8'],
    future: ['#6fe1e8', '#a98bff', '#ff78b7', '#dffcff'],
    nature: ['#79c267', '#ffd45a', '#6fe1e8', '#c88b55'],
    chaos: ['#ff9c5a', '#ff78b7', '#ffd45a', '#6fe1e8'],
    default: ['#ffd45a', '#ff78b7', '#6fe1e8', '#9be36f']
  };

  const typeLabels = {
    plush: ['PLUSH', 'CHARACTER'],
    building: ['BUILDING'],
    tabletop: ['TABLETOP'],
    electronic: ['ELECTRONIC'],
    outdoor: ['OUTDOOR'],
    music: ['MUSICAL'],
    desk: ['DESK TOY']
  };

  const vibeLabels = {
    cozy: 'COZY',
    weird: 'WEIRD',
    spooky: 'SPOOKY',
    gross: 'GROSS',
    future: 'FUTURE',
    nature: 'NATURE',
    chaos: 'SLAPSTICK CHAOS'
  };

  const escapeXml = value => String(value).replace(/[<>&"']/g, character => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
  })[character]);

  const hash = value => {
    let result = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      result ^= value.charCodeAt(index);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  };

  const seeded = seed => {
    let state = seed || 1;
    return () => {
      state += 0x6D2B79F5;
      let value = state;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  };

  function identifyType(tags) {
    const upper = tags.toUpperCase();
    return Object.entries(typeLabels).find(([, labels]) => labels.some(label => upper.includes(label)))?.[0] || 'electronic';
  }

  function identifyVibe(tags) {
    const upper = tags.toUpperCase();
    return Object.entries(vibeLabels).find(([, label]) => upper.includes(label))?.[0] || 'default';
  }

  function callout(x1, y1, x2, y2, label, align = 'start') {
    const textX = align === 'end' ? x2 - 8 : x2 + 8;
    return `
      <g>
        <path class="sketch-line sketch-dash" d="M${x1} ${y1} L${x2} ${y2}"/>
        <circle cx="${x1}" cy="${y1}" r="5" fill="#20172b"/>
        <text class="sketch-small" x="${textX}" y="${y2 - 7}" text-anchor="${align}">${escapeXml(label)}</text>
      </g>`;
  }

  function face(cx, cy, scale = 1) {
    return `
      <circle cx="${cx - 18 * scale}" cy="${cy}" r="${5 * scale}" fill="#20172b"/>
      <circle cx="${cx + 18 * scale}" cy="${cy}" r="${5 * scale}" fill="#20172b"/>
      <path d="M${cx - 17 * scale} ${cy + 19 * scale} Q${cx} ${cy + 31 * scale} ${cx + 17 * scale} ${cy + 19 * scale}" class="sketch-line"/>`;
  }

  function plushShape(colors, random) {
    const earTilt = Math.round((random() - .5) * 18);
    return `
      <ellipse class="sketch-shadow" cx="365" cy="352" rx="145" ry="25"/>
      <g transform="rotate(${earTilt} 360 205)">
        <circle cx="300" cy="119" r="52" fill="${colors[1]}" stroke="#20172b" stroke-width="6"/>
        <circle cx="430" cy="119" r="52" fill="${colors[1]}" stroke="#20172b" stroke-width="6"/>
        <ellipse cx="365" cy="235" rx="122" ry="130" fill="${colors[0]}" stroke="#20172b" stroke-width="7"/>
        <ellipse cx="365" cy="185" rx="100" ry="88" fill="${colors[3]}" stroke="#20172b" stroke-width="6"/>
        <rect x="326" y="252" width="78" height="58" rx="24" fill="${colors[2]}" stroke="#20172b" stroke-width="5"/>
        <ellipse cx="245" cy="252" rx="34" ry="73" fill="${colors[0]}" stroke="#20172b" stroke-width="6" transform="rotate(25 245 252)"/>
        <ellipse cx="485" cy="252" rx="34" ry="73" fill="${colors[0]}" stroke="#20172b" stroke-width="6" transform="rotate(-25 485 252)"/>
        ${face(365, 183, 1.05)}
      </g>
      ${callout(403, 278, 563, 236, 'HIDDEN POCKET')}
      ${callout(292, 188, 151, 145, 'SOFT FACE', 'end')}
      ${callout(475, 272, 598, 327, 'SQUEEZE ZONE')}`;
  }

  function buildingShape(colors, random) {
    const topShift = Math.round((random() - .5) * 35);
    return `
      <ellipse class="sketch-shadow" cx="365" cy="355" rx="180" ry="24"/>
      <rect x="222" y="278" width="286" height="70" rx="12" fill="${colors[2]}" stroke="#20172b" stroke-width="7"/>
      <rect x="255" y="202" width="114" height="76" rx="10" fill="${colors[0]}" stroke="#20172b" stroke-width="7"/>
      <rect x="369" y="202" width="106" height="76" rx="10" fill="${colors[1]}" stroke="#20172b" stroke-width="7"/>
      <rect x="${310 + topShift}" y="126" width="118" height="76" rx="10" fill="${colors[3]}" stroke="#20172b" stroke-width="7"/>
      <circle cx="270" cy="313" r="18" fill="${colors[1]}" stroke="#20172b" stroke-width="5"/>
      <circle cx="460" cy="313" r="18" fill="${colors[0]}" stroke="#20172b" stroke-width="5"/>
      <path d="M475 202 L547 145 L565 165 L504 224" fill="${colors[2]}" stroke="#20172b" stroke-width="7" stroke-linejoin="round"/>
      ${callout(370, 163, 193, 120, 'SWAP-ABLE MODULE', 'end')}
      ${callout(460, 313, 590, 286, 'ROLLING BASE')}
      ${callout(535, 173, 612, 114, 'CHALLENGE ARM')}`;
  }

  function tabletopShape(colors, random) {
    const spin = Math.round(random() * 300);
    return `
      <ellipse class="sketch-shadow" cx="365" cy="350" rx="210" ry="24"/>
      <path d="M190 150 L510 125 L565 310 L240 339 Z" fill="${colors[3]}" stroke="#20172b" stroke-width="7" stroke-linejoin="round"/>
      <path d="M255 178 L455 160 L490 276 L287 296 Z" fill="${colors[2]}" stroke="#20172b" stroke-width="5"/>
      <g transform="rotate(${spin} 385 225)">
        <circle cx="385" cy="225" r="49" fill="${colors[0]}" stroke="#20172b" stroke-width="6"/>
        <path d="M385 181 L398 220 L385 269 L372 220 Z" fill="${colors[1]}" stroke="#20172b" stroke-width="4"/>
      </g>
      <rect x="165" y="245" width="80" height="108" rx="9" fill="${colors[1]}" stroke="#20172b" stroke-width="6" transform="rotate(-9 205 299)"/>
      <circle cx="528" cy="205" r="22" fill="${colors[0]}" stroke="#20172b" stroke-width="5"/>
      <circle cx="545" cy="245" r="17" fill="${colors[1]}" stroke="#20172b" stroke-width="5"/>
      ${callout(385, 225, 585, 142, 'CHANGING CENTER')}
      ${callout(205, 278, 116, 204, 'ACTION CARDS', 'end')}
      ${callout(530, 225, 620, 285, 'PLAYER TOKENS')}`;
  }

  function electronicShape(colors, random) {
    const buttonCount = 3 + Math.floor(random() * 3);
    const buttons = Array.from({ length: buttonCount }, (_, index) => {
      const x = 290 + index * (150 / Math.max(1, buttonCount - 1));
      return `<circle cx="${x}" cy="286" r="17" fill="${colors[index % colors.length]}" stroke="#20172b" stroke-width="5"/>`;
    }).join('');

    return `
      <ellipse class="sketch-shadow" cx="365" cy="348" rx="175" ry="25"/>
      <path d="M260 105 L315 145" class="sketch-line"/><circle cx="252" cy="96" r="12" fill="${colors[1]}" stroke="#20172b" stroke-width="5"/>
      <rect x="210" y="132" width="310" height="202" rx="44" fill="${colors[0]}" stroke="#20172b" stroke-width="8"/>
      <rect x="255" y="169" width="220" height="77" rx="18" fill="${colors[2]}" stroke="#20172b" stroke-width="6"/>
      <path d="M282 211 Q315 176 349 211 T419 211 T452 205" class="sketch-line"/>
      ${buttons}
      <g fill="#20172b">${[0,1,2,3].map(index => `<circle cx="${477 + (index % 2) * 16}" cy="${280 + Math.floor(index / 2) * 16}" r="4"/>`).join('')}</g>
      ${callout(365, 208, 588, 151, 'RESPONSE SCREEN')}
      ${callout(365, 286, 603, 314, 'PLAYER INPUTS')}
      ${callout(252, 96, 147, 120, 'SIGNAL ANTENNA', 'end')}`;
  }

  function outdoorShape(colors, random) {
    const markerY = 305 + Math.round(random() * 22);
    return `
      <path d="M115 347 Q245 275 365 334 T610 312" fill="none" stroke="${colors[2]}" stroke-width="20" stroke-linecap="round" opacity=".7"/>
      <circle cx="438" cy="205" r="105" fill="${colors[3]}" stroke="#20172b" stroke-width="8"/>
      <circle cx="438" cy="205" r="72" fill="${colors[1]}" stroke="#20172b" stroke-width="6"/>
      <circle cx="438" cy="205" r="38" fill="${colors[0]}" stroke="#20172b" stroke-width="6"/>
      <path d="M205 290 L282 230 L322 292 L245 350 Z" fill="${colors[0]}" stroke="#20172b" stroke-width="7"/>
      <circle cx="178" cy="${markerY}" r="25" fill="${colors[1]}" stroke="#20172b" stroke-width="6"/>
      <circle cx="570" cy="327" r="25" fill="${colors[2]}" stroke="#20172b" stroke-width="6"/>
      ${callout(438, 205, 601, 112, 'SOFT TARGET')}
      ${callout(258, 285, 127, 205, 'ACTION PIECE', 'end')}
      ${callout(570, 327, 632, 369, 'MOVEABLE MARKER')}`;
  }

  function musicShape(colors, random) {
    const wave = 8 + Math.round(random() * 8);
    return `
      <ellipse class="sketch-shadow" cx="365" cy="350" rx="190" ry="25"/>
      <path d="M190 190 Q190 125 255 125 H475 Q540 125 540 190 V315 H190 Z" fill="${colors[0]}" stroke="#20172b" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="255" cy="211" r="54" fill="${colors[3]}" stroke="#20172b" stroke-width="7"/>
      <g fill="#20172b">${[0,1,2,3,4,5,6,7].map(index => {
        const angle = index * Math.PI / 4;
        return `<circle cx="${255 + Math.cos(angle) * 28}" cy="${211 + Math.sin(angle) * 28}" r="4"/>`;
      }).join('')}</g>
      ${[0,1,2,3].map(index => `<rect x="${330 + index * 43}" y="178" width="32" height="42" rx="9" fill="${colors[(index + 1) % colors.length]}" stroke="#20172b" stroke-width="5"/>`).join('')}
      <path d="M330 270 Q350 ${270-wave} 370 270 T410 270 T450 270 T490 270" class="sketch-line"/>
      <circle cx="345" cy="311" r="13" fill="${colors[1]}" stroke="#20172b" stroke-width="4"/>
      <circle cx="395" cy="311" r="13" fill="${colors[2]}" stroke="#20172b" stroke-width="4"/>
      ${callout(255, 211, 107, 147, 'SPEAKER / VOICE', 'end')}
      ${callout(410, 198, 605, 139, 'PLAY PADS')}
      ${callout(410, 270, 606, 291, 'LIVE LOOP')}`;
  }

  function deskShape(colors, random) {
    const rotation = Math.round(random() * 35) - 17;
    return `
      <ellipse class="sketch-shadow" cx="365" cy="349" rx="155" ry="22"/>
      <rect x="275" y="298" width="180" height="42" rx="21" fill="${colors[3]}" stroke="#20172b" stroke-width="7"/>
      <g transform="rotate(${rotation} 365 222)">
        <circle cx="365" cy="222" r="52" fill="${colors[0]}" stroke="#20172b" stroke-width="7"/>
        <path d="M365 170 L404 115 L432 139 L396 194 Z" fill="${colors[1]}" stroke="#20172b" stroke-width="6"/>
        <path d="M417 222 L478 249 L462 282 L397 248 Z" fill="${colors[2]}" stroke="#20172b" stroke-width="6"/>
        <path d="M365 274 L324 326 L294 300 L333 247 Z" fill="${colors[1]}" stroke="#20172b" stroke-width="6"/>
        <path d="M313 222 L254 192 L272 159 L334 196 Z" fill="${colors[2]}" stroke="#20172b" stroke-width="6"/>
        <circle cx="365" cy="222" r="18" fill="${colors[3]}" stroke="#20172b" stroke-width="5"/>
      </g>
      ${callout(365, 222, 585, 153, 'WEIGHTED PIVOT')}
      ${callout(431, 138, 571, 90, 'TACTILE ARM')}
      ${callout(365, 320, 590, 340, 'QUIET BASE')}`;
  }

  const shapeBuilders = {
    plush: plushShape,
    building: buildingShape,
    tabletop: tabletopShape,
    electronic: electronicShape,
    outdoor: outdoorShape,
    music: musicShape,
    desk: deskShape
  };

  function renderVisual() {
    const name = toyName.textContent.trim() || 'New Toy';
    const tags = resultTags.textContent.trim();
    const type = identifyType(tags);
    const vibe = identifyVibe(tags);
    const colors = palettes[vibe] || palettes.default;
    const random = seeded(hash(`${name}:${tags}:${remix}`));
    const builder = shapeBuilders[type] || shapeBuilders.electronic;
    const safeName = escapeXml(name.length > 34 ? `${name.slice(0, 31)}…` : name);
    const shape = builder(colors, random);

    svg.innerHTML = `
      <title id="toy-sketch-title">Concept sketch for ${escapeXml(name)}</title>
      <desc id="toy-sketch-desc">A generated ${escapeXml(vibe)} ${escapeXml(type)} toy sketch with callouts for major interaction areas.</desc>
      <rect x="14" y="14" width="692" height="392" rx="26" fill="rgba(255,253,246,.38)" stroke="#20172b" stroke-width="3" stroke-dasharray="8 8"/>
      <text class="sketch-small" x="40" y="48">MATTBEAR TOY FORGE / ROUGH CONCEPT</text>
      <text class="sketch-label" x="40" y="385">${safeName}</text>
      <text class="sketch-small" x="680" y="385" text-anchor="end">${escapeXml(type.toUpperCase())} / ${escapeXml(vibe.toUpperCase())}</text>
      <g class="sketch-object">${shape}</g>`;

    paletteBox.replaceChildren();
    const label = document.createElement('b');
    label.className = 'visual-palette-label';
    label.textContent = 'Palette';
    paletteBox.append(label);
    colors.forEach((color, index) => {
      const chip = document.createElement('span');
      chip.style.background = color;
      chip.title = `${color} — color ${index + 1}`;
      paletteBox.append(chip);
    });

    const parts = toyParts?.textContent.split(',').slice(0, 2).join(' + ') || 'main action + surprise';
    caption.innerHTML = `<strong>${escapeXml(name)}:</strong> visual direction based on ${escapeXml(vibe)} styling and ${escapeXml(type)} construction. Suggested focus: ${escapeXml(parts)}.`;
  }

  function saveSvg() {
    const name = toyName.textContent.trim() || 'MATTBEAR Toy';
    const clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '1440');
    clone.setAttribute('height', '840');
    const source = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name} - Concept Sketch.svg`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  remixButton.addEventListener('click', () => {
    remix += 1;
    renderVisual();
  });

  saveButton.addEventListener('click', saveSvg);

  const observer = new MutationObserver(() => {
    remix = 0;
    window.requestAnimationFrame(renderVisual);
  });

  observer.observe(toyName, { childList: true, characterData: true, subtree: true });
  observer.observe(resultTags, { childList: true, characterData: true, subtree: true });
  if (toyParts) observer.observe(toyParts, { childList: true, characterData: true, subtree: true });

  renderVisual();
})();
