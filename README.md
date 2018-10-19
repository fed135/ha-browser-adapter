<h1 align="center">
  Browser IndexedDB adapter for HA-store
</h1>
<h3 align="center">
    Why not IndexedDB ?
  <br/><br/><br/>
</h3>
<br/>

[![ha-store-browser](https://img.shields.io/npm/v/ha-store-browser.svg)](https://www.npmjs.com/package/ha-store-browser)
[![Node](https://img.shields.io/badge/node->%3D8.0-blue.svg)](https://nodejs.org)
[![Build Status](https://travis-ci.org/fed135/ha-browser-adapter.svg?branch=master)](https://travis-ci.org/fed135/ha-browser-adapter)
[![Dependencies Status](https://david-dm.org/fed135/ha-store-browser.svg)](https://david-dm.org/fed135/ha-store-browser)

---

**HA-store-browser** is a plugin to replace the default in-memory storage in [ha-store](https://github.com/fed135/ha-store). Keys will be put in indexedDB, for faster page load times.

---

## Installing

`npm install ha-store-browser`


## Usage

**Store**
```node
const store = require('ha-store');
const browserStore = require('ha-store-browser')();
const itemStore = store({
  resolver: getItems,
  store: browserStore,
});
```


## Testing

`npm test`


## Contribute

Please do! This is an open source project - if you see something that you want, [open an issue](https://github.com/fed135/ha-browser-adapter/issues/new) or file a pull request.

If you have a major change, it would be better to open an issue first so that we can talk about it. 

I am always looking for more maintainers, as well. Get involved. 


## License 

[Apache 2.0](LICENSE) (c) 2018 Frederic Charette

