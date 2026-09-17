(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const counter = byId('click-count');
  const status = byId('toy-status');
  const eggStatus = byId('egg-status');
  const launchButton = byId('launch-button');
  const figure = document.querySelector('.profile-figure');
  const secretButton = byId('secret-button');
  const headerNote = document.querySelector('.header-note');
  const clickReward = byId('click-reward');
  const flightReward = byId('flight-reward');
  const turboReward = byId('turbo-reward');
  const photoCaption = byId('photo-caption');
  const milestones = new Map([
    [1, 'Du hattest genau eine Aufgabe.'],
    [5, 'Fünf Klicks. Null Fortschritt.'],
    [10, 'Die Produktivität bleibt stabil bei null.'],
    [25, 'Das hätte eine Pause sein können.'],
    [42, 'Die Antwort auf alles. Die Frage fehlt noch.'],
    [67, '67. SIX SEVEN. Dafür gibt’s jetzt eine Belohnung. Angeblich.'],
    [69, 'nice.'],
    [100, '100 Klicks. Bitte nicht in den Lebenslauf schreiben.'],
    [250, 'Der Knopf hat inzwischen Vertrauen zu dir.'],
    [1000, 'Du und dieser Knopf. Das ist jetzt was Ernstes.'],
  ]);
  const launchLines = [
    'Zündung läuft. Der TÜV schaut kurz weg.',
    'Flughöhe: über den Dingen.',
    'Houston, WLAN ist weg.',
    'Umlaufbahn erreicht. Ladekabel vergessen.',
    'Der Bordcomputer will ein Update. Natürlich jetzt.',
    'Immerhin keine Parkplatzsuche.',
    'Mission: kurz verschwinden. Läuft.',
    'Das war Absicht. Sagt zumindest die Flugleitung.',
    'Schwerkraft wurde höflich ignoriert.',
    'Die Erde ist auch nur ein sehr großer Kreisverkehr.',
    'Rückflug gebucht. Fensterplatz war leider extra.',
    'Kurz den Mond gegrüßt. Kam nichts zurück.',
  ];
  const launchMilestones = new Map([
    [5, 'Fünf Starts. Dein Flugprotokoll ist freigeschaltet.'],
    [10, 'Zehn Starts. NASA hat deine Nummer stummgeschaltet.'],
    [25, '25 Starts. Das Profilbild braucht langsam Urlaub.'],
    [42, '42. Handtuch dabei?'],
    [67, 'SIX SEVEN. Auch im Orbit nicht zu erklären.'],
    [69, 'nice. Diesmal in Schwerelosigkeit.'],
    [100, '100 Starts. Du bist jetzt Inventar auf der ISS.'],
  ]);
  let clicks = 0;
  let launches = 0;
  let launchTimer;
  let modeTimer;
  let buffer = '';
  let lastKey = 0;
  let turboMode = false;

  byId('sidequest').hidden = false;
  launchButton.disabled = false;
  photoCaption.textContent = 'Seit ewig dabei. Kann jetzt abheben.';

  byId('useless-button').addEventListener('click', () => {
    clicks = Math.min(clicks + 1, 9999);
    counter.textContent = clicks.toLocaleString('de-DE');
    clickReward.hidden = clicks < 67;
    status.textContent = milestones.get(clicks) || (clicks === 9999
      ? '9.999. Mehr gibt das sinnlose Universum nicht her.'
      : `${clicks.toLocaleString('de-DE')} Klicks. Noch immer kein Mehrwert.`);
  });
  byId('reset-button').addEventListener('click', () => {
    clicks = 0;
    counter.textContent = '0';
    clickReward.hidden = true;
    status.textContent = 'Alles weg. War zum Glück nichts Wichtiges.';
  });
  launchButton.addEventListener('click', () => {
    if (launchTimer) return;
    launches += 1;
    figure.classList.add('launching');
    const line = launchMilestones.get(launches) || launchLines[(launches - 1) % launchLines.length];
    photoCaption.textContent = `Start ${launches}: ${line}`;
    eggStatus.textContent = `Start ${launches}: ${line}`;
    flightReward.hidden = launches < 5;
    launchTimer = setTimeout(() => {
      figure.classList.remove('launching');
      launchTimer = undefined;
    }, 1000);
  });
  function setTurboMode(active) {
    clearTimeout(modeTimer);
    turboMode = active;
    turboReward.hidden = !active;
    document.body.classList.toggle('turbo-mode', active);
    secretButton.setAttribute('aria-pressed', String(active));
    secretButton.textContent = active ? 'Aus' : '???';
    headerNote.textContent = active ? 'TURBO MODE' : 'PERSONAL SPACE';
    eggStatus.textContent = active
      ? 'Turbo-Modus. Optisch schneller. Technisch exakt gleich.'
      : 'Wieder normal. Also relativ.';
    if (active) modeTimer = setTimeout(() => setTurboMode(false), 8000);
  }
  secretButton.addEventListener('click', () => setTurboMode(!turboMode));
  document.addEventListener('keydown', event => {
    const target = event.target;
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat ||
        target?.isContentEditable || target?.closest?.('input, textarea, select, [role="textbox"]')) {
      buffer = '';
      return;
    }
    if (event.key.length !== 1 || !/^[a-z]$/i.test(event.key)) { buffer = ''; return; }
    const now = Date.now();
    if (now - lastKey > 2000) buffer = '';
    lastKey = now;
    buffer = (buffer + event.key.toLowerCase()).slice(-5);
    if (buffer === 'turbo') { buffer = ''; setTurboMode(!turboMode); }
  });
})();
