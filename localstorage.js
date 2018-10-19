/**
 * Browser store
 */

/* Methods -------------------------------------------------------------------*/

/**
 * Store constructor
 * @param {object} config The options for the store
 * @param {EventEmitter} emitter The event-emitter instance for the batcher
 * @param {Map} store A store instance to replace the default in-memory Map
 */
function browserStore(dbname, version) {
  dbname = dbname || 'ha-store';
  const store = localStorage;

  return (config, emitter) => {

    /**
     * Performs a query that returns a single entities to be cached
     * @param {object} opts The options for the dao
     * @param {string} method The dao method to call
     * @returns {Promise}
     */
    function get(key) {
      let res = store.getItem(`${dbname}.${key}`);
      if (res === undefined || res === null) return null;
      res = JSON.parse(res);
      const now = Date.now();
      const ttl = res.timestamp + config.cache.limit;
      // If expired
      if (now > ttl) {
        clear(key);
        return null;
      }
      return res;
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
        store.setItem(`${dbname}.${recordKey(id)}`, JSON.stringify({
          value: values[id],
          timestamp: now,
        }));
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
        for (let i in store) {
          if (i.startsWith(`${dbname}.`)) store.removeItem(i);
        }
        return true;
      }
      return !!store.removeItem(`${dbname}.${key}`);
    }

    async function size() {
      let hashLength = 0;
      for (let i in store) {
        if (i.startsWith(`${dbname}.`)) hashLength++;
      }
      return hashLength;
    }

    return { get, set, clear, size };
  };
}
  
/* Exports -------------------------------------------------------------------*/

module.exports = browserStore;
