import { InjectionToken } from '@angular/core';

export interface NgxHighlightConfig {
  /** tabReplace: a string used to replace TAB characters in indentation. */
  tabReplace?: string;
  /** useBR: a flag to generate <br> tags instead of new-line characters in the output, useful when code is marked up using a non-<pre> container. */
  useBR?: boolean;
  /** classPrefix: a string prefix added before class names in the generated markup, used for backwards compatibility with stylesheets. */
  classPrefix?: string;
  /** languages: an array of language names and aliases restricting auto detection to only these languages. */
  languages?: string[];
}

export interface HighlightResult {
  language?: string;
  secondBest?: any;
  top?: any;
  value?: string;
  relevance?: number;
}

export interface NgxHighlightOptions {
  config?: NgxHighlightConfig;
  languages?: { [name: string]: () => Promise<any> };
  coreLibraryLoader?: () => Promise<any>;
  fullLibraryLoader?: () => Promise<any>;
  lineNumbersLoader?: () => Promise<any>;
}

export const HIGHLIGHT_OPTIONS = new InjectionToken<NgxHighlightOptions>('HIGHLIGHT_OPTIONS');
