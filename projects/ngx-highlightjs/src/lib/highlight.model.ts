import { InjectionToken } from '@angular/core';


export interface HighlightConfig {
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
  second_best?: any;
  top?: any;
  value?: string;
  relevance?: number;
}

export interface HighlightOptions {
  config?: HighlightConfig;
  languages?: { [name: string]: () => Promise<any> };
  coreLibraryLoader?: () => Promise<any>;
  fullLibraryLoader?: () => Promise<any>;
  lineNumbersLoader?: () => Promise<any>;
}

export const HIGHLIGHT_OPTIONS = new InjectionToken<HighlightOptions>('HIGHLIGHT_OPTIONS');
