# Hyperswarm Replication Test

Just some experimental tests on how to replicate hypermerge documents via [Hyperswarm](https://github.com/hyperswarm). Requires manual fixes applied to hypermerge as [documented in this issue](https://github.com/automerge/hypermerge/issues/32).

To run a "serving" (or: creating) instance, simply run `node index.js`. The hypermerge doc's URL then is written to `feed.json`. Launch a "consuming" (or: listening) instance via `node index.js --client`. This instance purely consumes the replicated hypermerge document.
