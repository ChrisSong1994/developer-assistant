import { javascript } from './js';

export const categories = [javascript];

export function getDefaultCategory() {
  return javascript;
}

export function getDefaultParser(category = getDefaultCategory()) {
  return category.parsers[0];
}
