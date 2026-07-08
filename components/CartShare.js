function createCartShareUrl(cartItems, baseUrl = '') {
  const payload = encodeURIComponent(JSON.stringify(cartItems));
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  return `${origin}/cart?share=${payload}`;
}

function decodeSharedCart(queryString) {
  if (!queryString) {
    return null;
  }

  const params = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString);
  const sharedParam = params.get('share');

  if (!sharedParam) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(sharedParam));
  } catch (error) {
    console.error('Unable to decode shared cart payload:', error);
    return null;
  }
}

module.exports = {
  createCartShareUrl,
  decodeSharedCart,
};
