
;(function () {

const blacklist = [
  'tdsourcetag',
  'qq-pf-to',
];

const urlPresets = {
  tencent: 'https://www.tencent.com/'
};

const triggerPresets = {
  alert: () => () => alert('Greetings tdsourcetag!'),
  redirect: (url = 'tencent') => () => {
    if (urlPresets.hasOwnProperty(url)) {
      url = urlPresets[url];
    }
    window.location.replace(url);
  },
  function: (functionName) => () => window[functionName](),
  eval: (script) => () => eval(script),
};

const triggers = (
  document.currentScript &&
  document.currentScript.getAttribute('data-trigger') ||
  ''
).split('+').map((trigger) => {
  const match = trigger.match(/^(.+)(?:\((.*)\))?\s*$/);
  if (match == null) {
    return null;
  }
  const [, name, param] = match;
  if (triggerPresets.hasOwnProperty(name)) {
    return triggerPresets[name](param);
  }
  return null;
}).filter((notNil) => notNil != null);

if (triggers.length === 0) {
  triggers.push(triggerPresets.alert());
  triggers.push(triggerPresets.redirect());
}

const searchParams = new URLSearchParams(window.location.search);

const found = blacklist.find(searchParams.has.bind(searchParams));
if (found != null) {
  triggers.forEach((trigger) => trigger(searchParams.get(found)));
}

})();
