const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = value.toString(); },
  removeItem: (key) => { delete store[key]; },
  clear: () => {
    for (let key in store) delete store[key];
  }
};

global.fetch = async () => {
  throw new Error("Network error - forcing offline mode");
};

global.window = {
  dispatchEvent: () => {}
};
