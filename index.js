const hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const ram = require("random-access-memory");
const hypercore = require("hypercore");
const pump = require("pump");
const fs = require("fs");

let feed;
const client = process.argv.length > 2 && process.argv[2] === "--client";
if (client) {
  const key = Buffer.from(
    JSON.parse(fs.readFileSync(`${__dirname}/../feed.json`, "utf-8")).key
  );

  feed = hypercore(() => ram(), key);
} else {
  feed = hypercore(() => ram());
}

const swarm = hyperswarm();

// look for peers listed under this topic
const topic = crypto
  .createHash("sha256")
  .update("jans-hyperswarm-network-test")
  .digest();

const op = callback =>
  !client ? feed.append("cyber", (err, seq) => callback(err, seq)) : callback();

feed.on("ready", () => {
  if (!client) {
    console.log("key", feed.key.toString());

    fs.writeFileSync(
      `${__dirname}/../feed.json`,
      JSON.stringify({
        key: feed.key
      })
    );
  }

  op((err, seq) => {
    console.log("feed data appended");

    if (!client) {
      if (err) {
        console.error(err);
      } else {
        console.log("sequence", seq);
      }
    } else {
      feed.get(0, { wait: true }, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log("feed replicated:", data.toString());
        }
      });
    }

    feed.on("download", (index, data) =>
      console.log("downloaded", index, data.toString())
    );
    feed.on("upload", (index, data) => console.log("uploaded", index, data));

    swarm.join(topic, {
      lookup: client,
      announce: !client
    });
    console.log("swarming");

    swarm.on("connection", socket => {
      pump(socket, feed.replicate(), socket);
    });
  });
});
