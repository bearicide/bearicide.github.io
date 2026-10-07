(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const controls = {
    age: $('#age-select'),
    type: $('#type-select'),
    vibe: $('#vibe-select'),
    complexity: $('#complexity-select')
  };

  const output = {
    number: $('#result-number'),
    tags: $('#result-tags'),
    name: $('#toy-name'),
    pitch: $('#toy-pitch'),
    play: $('#toy-play'),
    twist: $('#toy-twist'),
    parts: $('#toy-parts'),
    prototype: $('#toy-prototype'),
    fun: $('#toy-fun'),
    safety: $('#toy-safety')
  };

  const buttons = {
    generate: $('#generate-button'),
    instant: $('#instant-button'),
    surprise: $('#surprise-button'),
    mutate: $('#mutate-button'),
    copy: $('#copy-button'),
    save: $('#save-button'),
    clearSaved: $('#clear-saved-button')
  };

  const savedList = $('#saved-list');
  const resultPanel = $('#result-panel');
  const storageKey = 'mattbear-toy-forge-saved';

  const data = {
    ages: {
      '3-5': {
        label: 'Ages 3–5',
        need: 'big, simple actions and immediate feedback',
        safety: 'Use oversized parts, rounded edges, washable materials, and direct adult supervision during prototyping.'
      },
      '6-8': {
        label: 'Ages 6–8',
        need: 'clear rules, repeatable surprises, and room for make-believe',
        safety: 'Avoid small detachable parts where inappropriate, pinch points, sharp edges, and fragile finishes.'
      },
      '9-12': {
        label: 'Ages 9–12',
        need: 'skill growth, customization, and something worth mastering',
        safety: 'Check materials, battery access, projectiles, cords, magnets, and tool use against the intended age range.'
      },
      'teen-adult': {
        label: 'Teen / adult',
        need: 'depth, collectibility, social play, or satisfying physical interaction',
        safety: 'Prototype with appropriate tools and materials; clearly label magnets, batteries, heat, moving parts, and adult-only components.'
      }
    },
    types: {
      plush: {
        label: 'Plush / character',
        nouns: ['Critter', 'Buddy', 'Beast', 'Gremlin', 'Mutt', 'Blob', 'Cub'],
        parts: ['soft shell', 'washable stuffing', 'embroidered face', 'hidden pocket', 'texture panels'],
        play: [
          'Players squeeze, fold, dress, and reposition the character to change its mood and role.',
          'The character reacts to being passed around, comforted, hidden, or posed during make-believe play.',
          'Players discover physical expressions by turning pockets, flaps, ears, and limbs inside out.'
        ]
      },
      building: {
        label: 'Building kit',
        nouns: ['Workshop', 'Stacker', 'Builder', 'Rig', 'Blocks', 'Machine', 'Lab'],
        parts: ['repeatable connectors', 'lightweight panels', 'axles', 'wheels', 'instruction cards'],
        play: [
          'Players combine a small set of reusable pieces into machines that solve short physical challenges.',
          'Each round begins with a prompt, then players build, test, break, and rebuild.',
          'The kit rewards stable structures first, then invites deliberately ridiculous modifications.'
        ]
      },
      tabletop: {
        label: 'Tabletop',
        nouns: ['Shuffle', 'Quest', 'Rumble', 'Deck', 'Dash', 'Council', 'Showdown'],
        parts: ['cards', 'tokens', 'folding board', 'timer', 'small draw bag'],
        play: [
          'Players take short turns making choices that alter a shared play space.',
          'The table changes every round as players place, trade, steal, or combine pieces.',
          'Simple rules create escalating consequences until the group reaches a strange final state.'
        ]
      },
      electronic: {
        label: 'Electronic',
        nouns: ['Console', 'Signal', 'Bot', 'Beacon', 'Circuit', 'Pocket Lab', 'Responder'],
        parts: ['large buttons', 'speaker', 'LEDs', 'microcontroller', 'battery compartment'],
        play: [
          'Players respond to changing lights and sounds, then teach the toy new patterns.',
          'The toy records a short action sequence and challenges the player to remix or repeat it.',
          'A few physical controls create many combinations instead of relying on a screen.'
        ]
      },
      outdoor: {
        label: 'Outdoor',
        nouns: ['Runner', 'Trail Kit', 'Launcher', 'Field Set', 'Chase', 'Rover', 'Target'],
        parts: ['weather-resistant markers', 'soft targets', 'carry pouch', 'chalk-safe pieces', 'score clips'],
        play: [
          'Players set up a course, complete a physical objective, then redesign the course for the next person.',
          'The toy turns open space into a changing game field with fast setup and no permanent installation.',
          'Players earn progress by moving, aiming, balancing, and helping reset the challenge.'
        ]
      },
      music: {
        label: 'Musical',
        nouns: ['Beat Box', 'Chime', 'Groove', 'Noise Pet', 'Rhythm Kit', 'Sound Sprout', 'Loop Lab'],
        parts: ['pressure pads', 'simple sound module', 'speaker', 'tempo control', 'record button'],
        play: [
          'Each physical action adds one sound, letting players build a loop without needing musical training.',
          'Players trade rhythms by tapping, shaking, squeezing, or connecting pieces.',
          'The toy starts with one voice and becomes more musical as players cooperate.'
        ]
      },
      desk: {
        label: 'Desk toy',
        nouns: ['Clicker', 'Fidget', 'Desk Beast', 'Spinner', 'Puzzle', 'Pocket Thing', 'Tumbler'],
        parts: ['weighted base', 'quiet hinges', 'magnets or detents', 'texture surfaces', 'replaceable shell'],
        play: [
          'The player discovers repeatable motions that feel satisfying without demanding full attention.',
          'Small mechanical actions combine into a quiet sequence of clicks, rolls, folds, and balances.',
          'The object can be rearranged into different resting forms, each with a distinct tactile response.'
        ]
      }
    },
    vibes: {
      cozy: {
        label: 'Cozy',
        adjectives: ['Cuddle', 'Sleepy', 'Warm', 'Blanket', 'Moonlit', 'Soft', 'Mellow'],
        visuals: 'soft shapes, friendly faces, warm colors, and reassuring feedback',
        twists: [
          'It becomes calmer and more expressive when players slow down instead of rushing.',
          'Every completed action creates a small comforting ritual for the next player.',
          'The toy stores tiny messages, patterns, or arrangements left by somebody else.'
        ]
      },
      weird: {
        label: 'Weird',
        adjectives: ['Wrong-Way', 'Inside-Out', 'Wobble', 'Oddball', 'Sideways', 'Unlicensed', 'Confused'],
        visuals: 'unexpected proportions, mismatched textures, and one detail that makes no sense until play begins',
        twists: [
          'The obvious way to use it is never the most effective way.',
          'One component has a secret second purpose that changes the whole toy.',
          'The rules deliberately reward unusual solutions instead of correct-looking ones.'
        ]
      },
      spooky: {
        label: 'Spooky',
        adjectives: ['Haunted', 'Midnight', 'Crypt', 'Ghost', 'Shadow', 'Creaky', 'Cursed'],
        visuals: 'deep colors, glowing marks, harmless suspense, and monster-movie personality',
        twists: [
          'The toy appears to remember the last person who played with it.',
          'A hidden state only appears when the room, board, or group becomes quiet.',
          'Players work with the monster instead of defeating it.'
        ]
      },
      gross: {
        label: 'Gross',
        adjectives: ['Goo', 'Snot', 'Moldy', 'Burp', 'Crusty', 'Slime', 'Trash'],
        visuals: 'cartoon mess, squishy forms, fake contamination, and exaggerated sound effects',
        twists: [
          'The grossest-looking move is secretly the cleanest or smartest strategy.',
          'Players collect pretend waste and transform it into upgrades.',
          'The toy makes ridiculous reactions but stays physically easy to clean.'
        ]
      },
      future: {
        label: 'Future',
        adjectives: ['Neon', 'Quantum', 'Signal', 'Orbit', 'Glitch', 'Nova', 'Chrome'],
        visuals: 'clean geometry, bright signals, modular parts, and readable sci-fi controls',
        twists: [
          'Players program behavior through physical arrangement rather than menus.',
          'The toy predicts one move ahead, then invites the player to fool it.',
          'Separate pieces become more capable when they detect or connect to one another.'
        ]
      },
      nature: {
        label: 'Nature',
        adjectives: ['Mossy', 'Acorn', 'Wild', 'Forest', 'Pond', 'Root', 'Beetle'],
        visuals: 'leaf, stone, bark, water, insect, and animal-inspired forms without copying nature literally',
        twists: [
          'The play pattern changes like a tiny ecosystem instead of resetting after each round.',
          'Players succeed by balancing competing needs rather than maximizing one score.',
          'The toy encourages noticing real sounds, shapes, or movement nearby.'
        ]
      },
      chaos: {
        label: 'Slapstick chaos',
        adjectives: ['Bonk', 'Crash', 'Wheeze', 'Panic', 'Flop', 'Oops', 'Mayhem'],
        visuals: 'bold readable forms, comic timing, exaggerated motion, and harmless failure',
        twists: [
          'Failure adds a new obstacle instead of ending the round.',
          'The toy builds tension slowly, then releases it in one safe ridiculous event.',
          'Players can rescue a bad move by making an even stranger move immediately.'
        ]
      }
    },
    rewards: {
      creativity: {
        label: 'creativity',
        line: 'The player changes the result through open-ended choices, not just speed or luck.'
      },
      movement: {
        label: 'movement',
        line: 'The play loop gives the body a clear job: reach, balance, carry, aim, mimic, or move.'
      },
      cooperation: {
        label: 'cooperation',
        line: 'Different players hold different pieces of the solution, so helping is mechanically useful.'
      },
      collection: {
        label: 'collecting',
        line: 'Progress is visible through pieces, patterns, badges, forms, or discoveries worth arranging.'
      },
      sound: {
        label: 'sound',
        line: 'Audio feedback communicates progress and invites players to create patterns instead of tolerating random noise.'
      }
    },
    complexity: {
      simple: {
        label: 'Simple prototype',
        prototype: 'Build the entire play loop from cardboard, paper fasteners, tape, markers, fabric scraps, and household objects. Test the behavior before appearance.'
      },
      medium: {
        label: 'Weekend build',
        prototype: 'Make one sturdy working feature using foam board, fabric, recycled plastic, simple hardware, or a basic microcontroller. Fake every nonessential feature.'
      },
      wild: {
        label: 'Full invention',
        prototype: 'Separate the invention into one physical mechanic, one feedback system, and one shell. Prototype each independently before combining them.'
      }
    }
  };

  const genericNames = ['Thing', 'Toy', 'Machine', 'Kit', 'Contraption', 'Creature', 'Device'];
  const genericParts = ['body shell', 'interaction pieces', 'visual markers', 'storage container', 'instruction card'];
  const genericPlay = [
    'Players manipulate a small set of pieces, observe the result, and change their approach on the next attempt.',
    'The toy creates a short repeatable challenge with enough variation to encourage another round.',
    'Players build a state, trigger a response, then rearrange the toy to produce a different outcome.'
  ];

  let conceptCount = 0;
  let currentConcept = null;

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function randomKey(object) {
    return randomItem(Object.keys(object));
  }

  function selectedRewards() {
    const values = $$('input[name="reward"]:checked').map(input => input.value);
    return values.length ? values : ['creativity'];
  }

  function resolveSelection(control, source) {
    return control.value === 'any' ? randomKey(source) : control.value;
  }

  function titleCase(value) {
    return value.replace(/(^|[-\s])\w/g, letter => letter.toUpperCase()).replace('-', '–');
  }

  function uniqueSample(items, amount) {
    const pool = [...new Set(items)];
    const result = [];
    while (pool.length && result.length < amount) {
      result.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return result;
  }

  function buildConcept({ mutate = false } = {}) {
    const ageKey = resolveSelection(controls.age, data.ages);
    const typeKey = resolveSelection(controls.type, data.types);
    const vibeKey = resolveSelection(controls.vibe, data.vibes);
    const complexityKey = controls.complexity.value;
    const rewardKeys = selectedRewards();

    const age = data.ages[ageKey];
    const type = data.types[typeKey];
    const vibe = data.vibes[vibeKey];
    const complexity = data.complexity[complexityKey];
    const reward = data.rewards[randomItem(rewardKeys)];

    const adjective = randomItem(vibe.adjectives);
    const noun = randomItem(type.nouns || genericNames);
    let name = `${adjective} ${noun}`;

    if (mutate && currentConcept) {
      const mutations = [
        () => { name = `${randomItem(vibe.adjectives)} ${currentConcept.baseNoun}`; },
        () => { name = `${currentConcept.baseAdjective} ${randomItem(type.nouns || genericNames)}`; },
        () => { name = `${randomItem(vibe.adjectives)} ${randomItem(type.nouns || genericNames)}`; }
      ];
      randomItem(mutations)();
    }

    const parts = uniqueSample([
      ...(type.parts || genericParts),
      rewardKeys.includes('sound') ? 'intentional sound feedback' : null,
      rewardKeys.includes('collection') ? 'collectible markers' : null,
      rewardKeys.includes('cooperation') ? 'paired player pieces' : null,
      rewardKeys.includes('movement') ? 'floor or distance markers' : null,
      rewardKeys.includes('creativity') ? 'blank customization pieces' : null
    ].filter(Boolean), complexityKey === 'simple' ? 4 : 5);

    const play = randomItem(type.play || genericPlay);
    const twist = randomItem(vibe.twists);
    const rewardLabels = rewardKeys.map(key => data.rewards[key].label);
    const pitch = `A ${vibe.label.toLowerCase()} ${type.label.toLowerCase()} for ${age.label.toLowerCase()} built around ${rewardLabels.join(', ')}. It uses ${vibe.visuals}.`;
    const whyFun = `${reward.line} The result is readable immediately, but the player still has room to improve, personalize, or surprise somebody else.`;
    const prototype = `${complexity.prototype} First test: can a new player understand the main action in under thirty seconds without a long explanation?`;

    return {
      id: Date.now(),
      name,
      baseAdjective: adjective,
      baseNoun: noun,
      ageKey,
      ageLabel: age.label,
      typeKey,
      typeLabel: type.label,
      vibeKey,
      vibeLabel: vibe.label,
      complexityKey,
      complexityLabel: complexity.label,
      rewardKeys,
      pitch,
      play,
      twist,
      parts: parts.join(', '),
      prototype,
      fun: whyFun,
      safety: age.safety
    };
  }

  function renderConcept(concept, { scroll = true } = {}) {
    conceptCount += 1;
    currentConcept = concept;

    output.number.textContent = `CONCEPT ${String(conceptCount).padStart(3, '0')}`;
    output.tags.textContent = `${concept.typeLabel.toUpperCase()} / ${concept.vibeLabel.toUpperCase()} / ${concept.complexityLabel.toUpperCase()}`;
    output.name.textContent = concept.name;
    output.pitch.textContent = concept.pitch;
    output.play.textContent = concept.play;
    output.twist.textContent = concept.twist;
    output.parts.textContent = concept.parts;
    output.prototype.textContent = concept.prototype;
    output.fun.textContent = concept.fun;
    output.safety.textContent = concept.safety;

    document.title = `${concept.name} | MATTBEAR Toy Forge`;

    if (scroll && window.matchMedia('(max-width: 980px)').matches) {
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function randomizeControls() {
    Object.entries(controls).forEach(([key, select]) => {
      if (key === 'complexity') {
        select.value = randomItem(['simple', 'medium', 'wild']);
        return;
      }
      const options = [...select.options].map(option => option.value).filter(value => value !== 'any');
      select.value = randomItem(options);
    });

    const rewardInputs = $$('input[name="reward"]');
    rewardInputs.forEach(input => { input.checked = false; });
    uniqueSample(rewardInputs, Math.random() > .55 ? 2 : 1).forEach(input => { input.checked = true; });
  }

  function conceptText(concept) {
    return `${concept.name}\n\n${concept.pitch}\n\nHOW IT PLAYS\n${concept.play}\n\nTHE TWIST\n${concept.twist}\n\nPARTS\n${concept.parts}\n\nPROTOTYPE IT\n${concept.prototype}\n\nWHY IT IS FUN\n${concept.fun}\n\nDESIGN CHECK\n${concept.safety}\n\nGenerated by MATTBEAR Toy Forge — https://bearicide.github.io/toy-generator/`;
  }

  async function copyCurrent() {
    if (!currentConcept) return;
    const text = conceptText(currentConcept);

    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }

    const original = buttons.copy.textContent;
    buttons.copy.textContent = 'Copied';
    window.setTimeout(() => { buttons.copy.textContent = original; }, 1200);
  }

  function loadSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function writeSaved(items) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items.slice(0, 12)));
      return true;
    } catch (_) {
      return false;
    }
  }

  function renderSaved() {
    const items = loadSaved();
    savedList.replaceChildren();

    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'saved-empty';
      empty.textContent = 'Nothing saved yet. Strong ideas will stay on this device.';
      savedList.append(empty);
      return;
    }

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'saved-card';

      const title = document.createElement('h3');
      title.textContent = item.name;

      const meta = document.createElement('p');
      meta.textContent = `${item.typeLabel} • ${item.vibeLabel} • ${item.ageLabel}`;

      const pitch = document.createElement('p');
      pitch.textContent = item.pitch;

      const open = document.createElement('button');
      open.type = 'button';
      open.textContent = 'Open concept';
      open.addEventListener('click', () => {
        renderConcept(item);
      });

      card.append(title, meta, pitch, open);
      savedList.append(card);
    });
  }

  function saveCurrent() {
    if (!currentConcept) return;
    const items = loadSaved().filter(item => item.name !== currentConcept.name || item.pitch !== currentConcept.pitch);
    items.unshift(currentConcept);

    if (writeSaved(items)) {
      renderSaved();
      const original = buttons.save.textContent;
      buttons.save.textContent = 'Saved';
      window.setTimeout(() => { buttons.save.textContent = original; }, 1200);
    } else {
      buttons.save.textContent = 'Storage blocked';
    }
  }

  function clearSaved() {
    try {
      localStorage.removeItem(storageKey);
    } catch (_) {
      // The visible list can still be reset even if storage is blocked.
    }
    renderSaved();
  }

  buttons.generate.addEventListener('click', () => renderConcept(buildConcept()));
  buttons.instant.addEventListener('click', () => {
    randomizeControls();
    renderConcept(buildConcept());
  });
  buttons.surprise.addEventListener('click', randomizeControls);
  buttons.mutate.addEventListener('click', () => renderConcept(buildConcept({ mutate: true })));
  buttons.copy.addEventListener('click', copyCurrent);
  buttons.save.addEventListener('click', saveCurrent);
  buttons.clearSaved.addEventListener('click', clearSaved);

  document.addEventListener('keydown', event => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    if (event.key.toLowerCase() === 'g' && !typing) {
      event.preventDefault();
      renderConcept(buildConcept());
    }
  });

  renderSaved();
  renderConcept(buildConcept(), { scroll: false });
})();
