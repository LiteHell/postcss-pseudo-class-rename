# postcss-pseudo-class-rename

[PostCSS] plugin to rename classes using specified pseudo class selector and unpack it surrounding them.

[PostCSS]: https://github.com/postcss/postcss

```css
/**
 * Input with these options
 * {pseudoSelectors:[{name: 'ipsum', rename: (className) => className.toUpperCase()}]}
 */
.foo:lorem(.bar):ipsum(.a.bc):sit(.bc) {
  display: inline-block;
  color: transparent;
}
```

```css
/* Output */
.foo.A.BC:lorem(.bar):sit(.bc) {
  /* `ipsum` pseudo selector is removed and classes inside that are renamed and added */
  display: inline-block;
  color: transparent;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-pseudo-class-rename
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-pseudo-class-rename')(opts),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage

## Options
Below is example of options.
```js
{
  pseudoSelectors: [
    {
      name: 'upperCase',
      rename: (className) => className.toUpperCase()
    }
  ]
}
```
With these options, input and output will be like this.
```css
p.good:upperCase(.boi) {
  /* input */
  background: gray;
}
```
```css
p.good.BOI {
  /* output with example options above */
  background: gray;
}
```
Option descriptions follow:
 * pseudoSelectors: **required**, an array of pseudo selectors to handle
   * name: **required** pseudo selector name
   * rename: **required** Callback for renaming classes inside pseudo selector. Return desired new class name to rename it, or return null not to rename it.

## License
Copyright (C) 2021 Yeonjin Shin, All rights reserved.

This library is distributed under MIT License. See [LICENSE](LICENSE) for more details.