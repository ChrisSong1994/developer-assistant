import { javascript } from './js';
import { css } from './css';
import { html } from './html';
import { graphql } from './graphql';
import { yaml } from './yaml';
import { markdown } from './markdown';
import { json } from './json';
import { sql } from './sql';
import { java } from './java';
import { python } from './python';
import { lua } from './lua';
import { rust } from './rust';

export const categories = [javascript, css, html, graphql, yaml, markdown, json, sql, java, python, lua, rust];

export function getDefaultCategory() {
  return javascript;
}

export function getDefaultParser(category = getDefaultCategory()) {
  return category.parsers[0];
}
