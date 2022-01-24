# Angular Highlight.js

Instant code highlighting, auto-detect language.

## Differences from the original
- Uses highlight.js@11.4.0.
- Built with and requires Angular@^13.0.0.
- Supports ESM module imports.
- Renamed some files for more intuitive usage.
- Removed HighlightLibrary interface in favour of highlight.js' own Typescript definition
- All other changes associated with Highlight.js 11.
___

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Issues](#issues)
- [Author](#author)
- [More plugins](#more-plugins)

<a name="installation"/>

## Installation

Install with **NPM**

```bash
npm i @kensingtontech/ngx-highlightjs
```

<a name="usage"/>

## Usage

### Import `HighlightModule` in your app

*Top Tip:*: Do this in app.module, not in a lazy-loaded module

```typescript
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

@NgModule({
  imports: [
    HighlightModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    }
  ],
})
export class AppModule { }
```

 > Note: This will add highlight.js library including all languages to your bundle.

To avoid import everything from highlight.js library, you should import each language you want to highlight manually.

### Import only the core library and the needed highlighting languages

```typescript
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
 
@NgModule({
  imports: [
    HighlightModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml')
        }
      }
    }
  ],
})
export class AppModule { }
```

### HighlightOptions API

| Name              | Description                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| fullLibraryLoader | A function that returns a promise that loads `highlight.js` full script                                                 |
| coreLibraryLoader | A function that returns a promise that loads `highlight.js` core script                                                 |
| lineNumbersLoader | A function that returns a promise that loads `line-numbers` script which adds line numbers to the highlight code        |
| languages         | The set of languages to register.                                                                                       |
| config            | Set highlight.js config, see [configure-options](http://highlightjs.readthedocs.io/en/latest/api.html#configure-option) |


 > **NOTE:** Since the update of highlight.js@v10.x.x, should use `coreLibraryLoader: () => import('highlight.js/lib/core')` instead of `coreLibraryLoader: () => import('highlight.js/lib/highlight')`

### Import highlighting theme

Import highlight.js theme from the node_modules directory in `angular.json`

```
"styles": [
  "styles.css",
  "../node_modules/highlight.js/styles/github.css",
]
```

Or import it in `src/style.scss`

```css
@import '~highlight.js/styles/github.css';
```

_[List of all available themes from highlight.js](https://github.com/isagalaev/highlight.js/tree/master/src/styles)_

### Use highlight directive

The following line will highlight the given code and append it to the host element

```html
<pre><code [highlight]="code"></code></pre>
```

[Demo stackblitz](https://stackblitz.com/edit/ngx-highlightjs)

## Options

| Name              | Type            | Description                                                                                                |
|-------------------|-----------------|------------------------------------------------------------------------------------------------------------|
| **[highlight]**   | string          | Accept code string to highlight, default `null`                                                            |
| **[languages]**   | string[]        | An array of language names and aliases restricting auto detection to only these languages, default: `null` |
| **[lineNumbers]** | boolean         | A flag that indicates adding line numbers to highlighted code element                                      |
| **(highlighted)** | HighlightResult | Stream that emits the result object when element is highlighted                                            |


### NOTE

In Angular 10, when building your project, you might get a warning `WARNING in ... CommonJS or AMD dependencies can cause optimization bailouts.`

To avoid this warning, add the following in your `angular.json`
```json
{
  "projects": {
    "project-name": {
      "architect": {
        "build": {
          "options": {
            "allowedCommonJsDependencies": [
              "highlight.js"
            ]
          }
        }
      }
    }
  }
}
```
Read more about [CommonJS dependencies configuration](https://angular.io/guide/build#configuring-commonjs-dependencies)

## Plus package

In version >= 4, a new sub-package were added with the following features:

- Highlight gists using gists API
- Highlight code directly from URL

### Usage

```typescript
import { HighlightPlusModule } from 'ngx-highlightjs/plus';
 
@NgModule({
  imports: [
    HighlightPlusModule
  ]
})
export class AppModule {
}
```

### Highlight a gist file

1. Use `[gist]` directive with the gist id to get the response through the output `(gistLoaded)`.
2. Once `(gistLoaded)` emits, you will get access to the gist response.
3. Use `gistContent` pipe to extract the file content from gist response using gist file name.

**Example:**

```html
<pre [gist]="gistId" (gistLoaded)="gist = $event">
  <code [highlight]="gist | gistContent: 'main.js'"></code>
</pre>
```

### Highlight all gist files

To loop over `gist?.files`, use `keyvalue` pipe to pass file name into `gistContent` pipe.

**Example:**

```html
<ng-container [gist]="gistId" (gistLoaded)="gist = $event">
  <pre *ngFor="let file of gist?.files | keyvalue">
    <code [highlight]="gist | gistContent: file.key"></code>
  </pre>
</ng-container>
```

### Highlight code from URL directly

Use the pipe `codeFromUrl` with the `async` pipe together to get the code text from a raw URL.

**Example:**

```html
<pre>
  <code [highlight]="codeUrl | codeFromUrl | async"></code>
</pre>
``` 

<a name="development"/>

## Development

This project uses Angular CLI to build the package.

```bash
$ ng build ngx-highlightjs
```

<a name="issues"/>

## Issues

Sorry, I'm not actively supporting this module.  It's for my own use and am sharing it with those who might find it useful.

<a name="author"/>

# Author

 **Tim Underhay**

- [github/murhafsousli](https://github.com/KensingtonTech)

## Original Author

 **Murhaf Sousli**

- [github/murhafsousli](https://github.com/MurhafSousli)
- [twitter/murhafsousli](https://twitter.com/MurhafSousli)
