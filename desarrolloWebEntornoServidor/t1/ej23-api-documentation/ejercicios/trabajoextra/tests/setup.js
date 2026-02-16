// Setup file executed before tests and before modules are imported.
// Silence console.error globally to reduce noisy output from intentional error branches exercised in tests.
if (typeof console !== 'undefined' && console.error) {
  console._error = console.error;
  console.error = () => {};
}
