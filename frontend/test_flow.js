import fs from 'fs';

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = value.toString(); },
  removeItem: (key) => { delete store[key]; },
  clear: () => {
    for (let key in store) delete store[key];
  }
};

// Mock fetch to simulate offline mode
global.fetch = async () => {
  throw new Error("Network error - forcing offline mode");
};

// Mock window dispatchEvent
global.window = {
  dispatchEvent: () => {}
};

// Import the api object. Since it's a JSX/ES module project using Vite, we can read the file and eval it or use dynamic import.
// Actually, since api.js uses ES modules (export const api), we can't easily require it in standard Node without babel/ts-node.
// Let's just create a test that directly exercises the logic by reading api.js.

async function runTest() {
  console.log("Loading API module...");
  // We'll read the api.js file and extract the needed logic to test it.
}

runTest();
