const hyperswarm = require("hyperswarm");
const storage = require("random-access-memory");
const { Repo } = require("hypermerge");
const pump = require("pump");
const fs = require("fs");

let url;
const client = process.argv.length > 2 && process.argv[2] === "--client";
const repo = new Repo({ path: ".data", storage });
const swarm = hyperswarm();

if (client) {
  url = JSON.parse(fs.readFileSync(`${__dirname}/feed.json`, "utf-8")).url;
  console.log("read url, going client");
} else {
  url = repo.create({ hello: "world" });
  console.log("created repo, going server", url);

  fs.writeFileSync(
    `${__dirname}/feed.json`,
    JSON.stringify({
      url
    })
  );
}

swarm.on("connection", (socket, { type, peer }) => {
  console.log("connected to peer");

  const info = {
    type: type,
    initiator: !!peer,
    id: null,
    host: peer ? peer.host : socket.remoteAddress,
    port: peer ? peer.port : socket.remotePort,
    channel: peer ? peer.topic : null
  };

  const rep = repo.stream(info);

  pump(socket, rep, socket, () => {
    console.log("data pumped");
  });
});

repo.replicate(swarm);
repo.watch(url, state =>
  console.log("repo changed", JSON.stringify(state, null, 2))
);
