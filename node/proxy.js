const proxy = new Proxy({}, {
  get: () => {
    const f = () => {};
    f.__proto__ = proxy;
    return f;
  },
});

module.exports = proxy;
