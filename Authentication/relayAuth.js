const config = require("../configuration.json");

const relayToken = config.RELAY_TOKEN;

function verifyRelay(req, res, next) {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    let [bearer, token] = bearerHeader.split(" ");

    if (bearer !== "Bearer") {
      res.status(403);
      res.json({ error: 'Accepting "Bearer" Token' });
    } else {
      if (token === relayToken) {
        req.relay = {}
        req.relay.isVerified = true;
        next();
      } else {
        res.status(403);
        res.json({ error: "Invalid Token" });
      }
    }
  } else {
    res.status(403);
    res.json({ error: "Accepting Bearer Token" });
  }
}

module.exports = verifyRelay;
