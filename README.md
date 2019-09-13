# Hyperswarm Replication Test

Just some experimental tests on how to replicate hypercore feeds via hyperswarm. Should be adapted to [hypermerge](https://github.com/automerge/hypermerge) in the future.

To run a "serving" (or: creating) instance, simply run `node index.js`. The hypercore feed's key then is written to `feed.json`. Launch a "consuming" (or: listening) instance via `node index.js --client`. This instance purely consumes the replicated hypercore feed.
