const test = require('node:test');
const assert = require('node:assert/strict');
const { createCartShareUrl, decodeSharedCart } = require('../components/CartShare');

test('creates a shareable cart URL from cart items', () => {
  const cartItems = [{ id: 1, name: 'Hat', quantity: 2 }];
  const shareUrl = createCartShareUrl(cartItems, 'https://example.com');

  assert.match(shareUrl, /^https:\/\/example\.com\/cart\?share=/);
});

test('decodes a shared cart snapshot from the query string', () => {
  const sharedCart = decodeSharedCart('?share=%5B%7B%22id%22%3A1%2C%22name%22%3A%22Hat%22%2C%22quantity%22%3A2%7D%5D');

  assert.deepEqual(sharedCart, [{ id: 1, name: 'Hat', quantity: 2 }]);
});

test('returns null when no shared cart payload is present', () => {
  const sharedCart = decodeSharedCart('');

  assert.equal(sharedCart, null);
});
