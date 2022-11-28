const postcss = require('postcss')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('Does nothing with null opts', async () => {
  await run('a:test(.b){ }', 'a:test(.b){ }', null)
})

it('Does nothing with empty object', async () => {
  await run('a:test(.b){ color: red; }', 'a:test(.b){ color: red; }', {})
})

it('Does unpack a specified pseudo selector', async () => {
  await run('a:lorem(.b){ color: red; } c:ipsum(.d){ color: blue; }', 'a.b{ color: red; } c:ipsum(.d){ color: blue; }', { pseudoSelectors: [{ name: 'lorem', rename: () => null }] });
})

it('Does unpack specified pseudo selectors', async () => {
  await run('a:lorem(.b){ color: red; } c:ipsum(.d){ color: blue; } e:sit(.f){ color: green; }', 'a.b{ color: red; } c:ipsum(.d){ color: blue; } e.f{ color: green; }', { pseudoSelectors: [{ name: 'lorem', rename: () => null }, { name: 'sit', rename: () => null }] });
})

it('Does rename classes inside a specified pseudo selector', async () => {
  await run('a:lorem(.eat.good.apple){ color: red; } c:ipsum(.d){ color: blue; }', 'a.__EAT.good.__APPLE{ color: red; } c:ipsum(.d){ color: blue; }', { pseudoSelectors: [{ name: 'lorem', rename: (className) => className === 'good' ? null : '__' + className.toUpperCase() }] });
})