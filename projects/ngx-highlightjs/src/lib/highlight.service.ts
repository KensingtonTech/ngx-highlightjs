import { Injectable, Inject, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { NgxHighlightConfig, HighlightResult, NgxHighlightOptions, HIGHLIGHT_OPTIONS } from './highlight.model';
import { HighlightLoader } from './highlight.loader';
import { HLJSApi } from 'highlight.js';
import { CompiledMode, Mode, Language, HighlightOptions } from 'highlight.js';

@Injectable({
  providedIn: 'root'
})
export class HighlightService {

  private _hljs: HLJSApi | null = null;

  // A reference for hljs library
  get hljs(): HLJSApi | null {
    return this._hljs;
  }

  constructor(
    private _loader: HighlightLoader,
    @Optional() @Inject(HIGHLIGHT_OPTIONS) options: NgxHighlightOptions) {
      // Load highlight.js library on init
      _loader.ready.pipe().subscribe((hljs: HLJSApi) => {
        this._hljs = hljs;
        if (options && options.config) {
          // Set global config if present
          hljs.configure(options.config);
          if (hljs.listLanguages().length < 1) {
            console.error('[HighlightJS]: No languages were registered!');
          }
        }
      });
  }

  /**
   * Core highlighting function.
   * @param name Accepts a language name, or an alias
   * @param value A string with the code to highlight.
   * @param ignore_illegals When present and evaluates to a true value, forces highlighting to finish
   * even in case of detecting illegal syntax for the language instead of throwing an exception.
   */
  highlight(codeOrLanguageName: string, optionsOrCode: string | HighlightOptions, ignoreIllegals?: boolean): Observable<HighlightResult> {
    return this._loader.ready.pipe(
      map((hljs: HLJSApi) => hljs.highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals))
    );
  }

  /**
   * Highlighting with language detection.
   * @param value Accepts a string with the code to highlight
   * @param languageSubset An optional array of language names and aliases restricting detection to only those languages.
   * The subset can also be set with configure, but the local parameter overrides the option if set.
   */
  highlightAuto(value: string, languageSubset: string[]): Observable<HighlightResult> {
    return this._loader.ready.pipe(
      map((hljs: HLJSApi) => hljs.highlightAuto(value, languageSubset))
    );
  }


  /**
   * Applies highlighting to a DOM node containing code.
   * The function uses language detection by default but you can specify the language in the class attribute of the DOM node.
   * See the class reference for all available language names and aliases.
   * @param block The element to apply highlight on.
   */
   highlightElement(block: HTMLElement): Observable<void> {
    return this._loader.ready.pipe(
      map((hljs: HLJSApi) => hljs.highlightElement(block))
    );
  }

  /**
   * Configures global options:
   * @param config HighlightJs configuration argument
   */
  configure(config: NgxHighlightConfig): Observable<void> {
    return this._loader.ready.pipe(
      map((hljs: HLJSApi) => hljs.configure(config))
    );
  }

  /**
   * Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
   */
  initHighlighting(): Observable<void> {
    return this._loader.ready.pipe(
      map((hljs: HLJSApi) => hljs.initHighlighting())
    );
  }

  /**
   * Adds new language to the library under the specified name. Used mostly internally.
   * @param name A string with the name of the language being registered
   * @param language A function that returns an object which represents the language definition.
   * The function is passed the hljs object to be able to use common regular expressions defined within it.
   */
  registerLanguage(name: string, language: () => any): Observable<HLJSApi> {
    return this._loader.ready.pipe(
      tap((hljs: HLJSApi) => hljs.registerLanguage(name, language))
    );
  }

  /**
   * @return The languages names list.
   */
  listLanguages(): Observable<string[]> {
    return this._loader.ready.pipe(
      map((hljs: HLJSApi) => hljs.listLanguages())
    );
  }

  /**
   * Looks up a language by name or alias.
   * @param name Language name
   * @return The language object if found, undefined otherwise.
   */
  getLanguage(name: string): Observable<any> {
    return this._loader.ready.pipe(
      map((hljs: HLJSApi) => hljs.getLanguage(name))
    );
  }

  /**
   * Display line numbers
   * @param el Code element
   */
  lineNumbersBlock(el: HTMLElement): Observable<any> {
    return this._loader.ready.pipe(
      filter((hljs: HLJSApi) => !!(hljs as any).lineNumbersBlock),
      tap((hljs: HLJSApi) => (hljs as any).lineNumbersBlock(el))
    );
  }
}
