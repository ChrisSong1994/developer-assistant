'use client';

// power by bytemd https://github.com/pd4d10/bytemd
import { useState } from 'react';
import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter';
import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import mermaid from '@bytemd/plugin-mermaid';
import { Editor } from '@bytemd/react';
import GFM_ZH from '@bytemd/plugin-gfm/locales/zh_Hans.json';
import MATH_ZH from '@bytemd/plugin-math/locales/zh_Hans.json';
import MERMAID_ZH from '@bytemd/plugin-mermaid/locales/zh_Hans.json';
import EDITOR_ZH from 'bytemd/locales/zh_Hans.json';
import 'github-markdown-css/github-markdown-light.css';

import MARKDOWN_TEXT from './text.md';
import './index.less';

const plugins = [
  gfm({ locale: GFM_ZH }),
  highlight(),
  frontmatter(),
  breaks(),
  gemoji(),
  math({ locale: MATH_ZH }),
  mediumZoom(),
  mermaid({ locale: MERMAID_ZH }),
  // {
  //   type: 'dropdown',
  //   actions: [
  //     {
  //       title: '导入',
  //       icon: `<svg viewBox="64 64 896 896" focusable="false"><path d="M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563v233zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75V563zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 00-11.3 0l-39.6 39.6a8.03 8.03 0 000 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0zm669.6-79.2l-39.6-39.6a8.03 8.03 0 00-11.3 0l-67.9 67.9a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3zM832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32zM484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8z" /></svg>`,
  //       // position: 'right',
  //       handler: {
  //         type: 'action',
  //         click() {},
  //       },
  //     },
  //     {
  //       title: '下载',
  //       icon: `<svg viewBox="64 64 896 896" focusable="false"><path d="M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563v233zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75V563zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 00-11.3 0l-39.6 39.6a8.03 8.03 0 000 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0zm669.6-79.2l-39.6-39.6a8.03 8.03 0 00-11.3 0l-67.9 67.9a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3zM832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32zM484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8z" /></svg>`,
  //       // position: 'right',
  //       handler: {
  //         type: 'action',
  //         click() {},
  //       },
  //     },
  //   ],
  // },
];

const Markdown = () => {
  const [value, setValue] = useState(MARKDOWN_TEXT);
  return (
    <section className="markdown-editor">
      <Editor
        value={value}
        plugins={plugins}
        locale={EDITOR_ZH}
        onChange={(v: any) => {
          setValue(v);
        }}
      />
    </section>
  );
};

export default Markdown;
