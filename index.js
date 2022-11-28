/**
 * Callback for renaming classes in pseudo selector
 * @callback PostcsspseudoClassRenameCallback
 * @param {string} className classname in the pseudo selector
 * @returns {string | null} Returns new classname to rename it, returns null if no plan to rename class
 */

/**
 * pseudo class representation for transformation by postcss-pseudo-class plugin
 * @typedef {{!name: string, !rename: PostcsspseudoClassRenameCallback}} PostcsspseudoClassObject
 */

/**
 * Options for postcss-pseudo-class plugin
 * @typedef {{!pseudoSelectors: PostcsspseudoClassObject[]}} PostcsspseudoClassOptions
 */

const selectorParser = require('postcss-selector-parser')

/**
 * @type {import('postcss').PluginCreator}
 * @param {PostcsspseudoClassOptions} opts
 */
module.exports = (opts) => {
  opts = Object.assign({ pseudoSelectors: [] }, opts);

  return {
    postcssPlugin: 'postcss-pseudo-class-rename',

    Rule(rule) {
      for (const target of opts.pseudoSelectors) {
        const pseudoSelector = `:${target.name}`;
        if (rule.selector.includes(pseudoSelector + '(')) {
          /**
           * 
           * @param {import('postcss-selector-parser').Selector} selectors 
           */
          const transform = selectors => {
            selectors.walkPseudos(pseudo => {
              if (pseudo.value === pseudoSelector) {
                pseudo.walkClasses(className => {
                  const newClass = target.rename(className.value);
                  if (newClass)
                    className.replaceWith(selectorParser.className({ value: newClass }));
                });

                pseudo.replaceWith(pseudo.nodes);
              }
            });
          }

          const transformed = selectorParser(transform).processSync(rule.selector);
          rule.assign({
            selector: transformed
          });
        }
      }
    }
  }
}

module.exports.postcss = true
