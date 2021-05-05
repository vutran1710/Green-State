import { __version__ } from '../src'

test('version check', () => {
  expect(__version__).toEqual('0.1.0')
});
