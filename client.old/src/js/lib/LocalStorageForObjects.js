export function localStorageSetObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function localStorageGetObject(key) {
  return JSON.parse(localStorage.getItem(key));
}
