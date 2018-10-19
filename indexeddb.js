/**
 * Browser store
 */

/* Requires ------------------------------------------------------------------*/

const DX = require('dexie').default;

/* Methods -------------------------------------------------------------------*/

/**
 * Store constructor
 * @param {object} config The options for the store
 * @param {EventEmitter} emitter The event-emitter instance for the batcher
 * @param {Map} store A store instance to replace the default in-memory Map
 */
function browserStore(dbname, version) {
  const store = new DX(dbname || 'ha-store');
  const localKey = `v${version || 0}`;
  store.version(0).stores({
    [localKey]: 'key, value, timestamp',
  });

  return (config, emitter) => {
    function storePluginErrorHandler(err) {
      try {
        clear('*')
      }
      catch(e) {}
      emitter.emit('storePluginErrored', err);
    }

    /**
     * Performs a query that returns a single entities to be cached
     * @param {object} opts The options for the dao
     * @param {string} method The dao method to call
     * @returns {Promise}
     */
    async function get(key) {
      return await store[localKey].get(key)
        .catch(storePluginErrorHandler)
        .then((res) => {
          if (res === undefined || !(res && res.value)) return null;
          const now = Date.now();
          const ttl = res.timestamp + config.cache.limit;
          // If expired
          if (now > ttl) {
            clear(key);
            return null;
          }
          return res;
        });
    }

    /**
     * Performs a query that returns a single entities to be cached
     * @param {object} opts The options for the dao
     * @param {string} method The dao method to call
     * @returns {Promise}
     */
    async function set(recordKey, keys, values, opts) {
      const now = Date.now();

      keys.forEach((id) => {
        store[localKey].put({
          key: recordKey(id),
          value: values[id],
          timestamp: now,
        }).catch(storePluginErrorHandler);
      });
      return true;
    }

    /**
     * Clears a specified computed key from the store
     * @param {string} key The key to search for
     * @returns {boolean} Wether the key was removed or not 
     */
    function clear(key) {
      if (key === '*') {
        return !!store[localKey].clear()
          .catch(storePluginErrorHandler);
      }
      return !!store[localKey].delete(key)
        .catch(storePluginErrorHandler);
    }

    async function size() {
      const hashLength = 0;/*await store.size()
        .catch(storePluginErrorHandler);*/
      return hashLength || 0;
    }

    return { get, set, clear, size };
  };
}
  
/* Exports -------------------------------------------------------------------*/

module.exports = browserStore;
