import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, from, EMPTY, zip, throwError } from 'rxjs';
import { catchError, tap, map, switchMap, filter, take } from 'rxjs/operators';
import { HIGHLIGHT_OPTIONS, NgxHighlightOptions } from './highlight.model';
import { mergeHTMLPlugin } from './htmlPlugin';
import { HLJSApi } from 'highlight.js';


// @dynamic
@Injectable({
  providedIn: 'root'
})

export class HighlightLoader {
  
  constructor(
    @Inject(DOCUMENT) doc: any,
    @Inject(PLATFORM_ID) platformId: object,
    @Optional() @Inject(HIGHLIGHT_OPTIONS) private _options: NgxHighlightOptions) {
      // Check if hljs is already available
      if (isPlatformBrowser(platformId) && doc.defaultView.hljs) {
        this._ready.next(doc.defaultView.hljs);
      }
      else {
        // Load hljs library
        this._loadLibrary().pipe(
          switchMap((hljs: HLJSApi ) => {
            hljs.addPlugin(mergeHTMLPlugin);
            if (this._options && this._options.lineNumbersLoader) {
              // Make hljs available on window object (required for the line numbers library)
              doc.defaultView.hljs = hljs;
              // Load line numbers library
              return this.loadLineNumbers().pipe(tap(() => this._ready.next(hljs)));
            }
            else {
              this._ready.next(hljs);
              return EMPTY;
            }
          }),
          catchError((e: any) => {
            console.error('[HLJS] ', e);
            return EMPTY;
          })
        ).subscribe();
      }
    }



  // Stream that emits when hljs library is loaded and ready to use
  private readonly _ready = new BehaviorSubject<HLJSApi | null>(null);
  readonly ready: Observable<HLJSApi> = this._ready.asObservable().pipe(
    filter((hljs: HLJSApi | null) => !!hljs),
    map((hljs: HLJSApi | null) => hljs as HLJSApi),
    take(1)
  );
  

  /**
   * Lazy-Load highlight.js library
   */
  private _loadLibrary(): Observable<any> {
    if (this._options) {
      if (this._options.fullLibraryLoader && this._options.coreLibraryLoader) {
        return throwError('The full library and the core library were imported, only one of them should be imported!');
      }
      if (this._options.fullLibraryLoader && this._options.languages) {
        return throwError('The highlighting languages were imported they are not needed!');
      }
      if (this._options.coreLibraryLoader && !this._options.languages) {
        return throwError('The highlighting languages were not imported!');
      }
      if (!this._options.coreLibraryLoader && this._options.languages) {
        return throwError('The core library was not imported!');
      }
      if (this._options.fullLibraryLoader) {
        return this.loadFullLibrary();
      }
      if (this._options.coreLibraryLoader && this._options.languages && Object.keys(this._options.languages).length) {
        return this.loadCoreLibrary().pipe(switchMap((hljs: HLJSApi) => this._loadLanguages(hljs)));
      }
    }
    return throwError('Highlight.js library was not imported!');
  }

  /**
   * Lazy-load highlight.js languages
   */
  private _loadLanguages(hljs: HLJSApi): Observable<any> {
    const languages = Object.entries(this._options.languages!).map(([langName, langLoader]) =>
      importModule(langLoader()).pipe(
        tap((langFunc: any) => hljs.registerLanguage(langName, langFunc))
      )
    );
    return zip(...languages).pipe(map(() => hljs));
  }


  /**
   * Import highlight.js core library
   */
  private loadCoreLibrary(): Observable<HLJSApi> {
    return importModule(this._options.coreLibraryLoader!());
  }

  /**
   * Import highlight.js library with all languages
   */
  private loadFullLibrary(): Observable<HLJSApi> {
    return importModule(this._options.fullLibraryLoader!());
  }


  /**
   * Import line numbers library
   */
  private loadLineNumbers(): Observable<any> {
    return importModule(this._options.lineNumbersLoader!());
  }
}

/**
 * Map loader response to module object
 */
const importModule = (moduleLoader: Promise<any>): Observable<any> => {
  return from(moduleLoader).pipe(
    filter((module: any) => !!module && !!module.default),
    map((module: any) => module.default)
  );
};
