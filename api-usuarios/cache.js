const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Erro no Redis:", err);
});

redisClient.connect();

const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
  const key = `${keyPrefix}:${req.originalUrl}`;

  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redisClient.setEx(key, 60, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  } catch (error) {
    console.error("Erro no middleware de cache:", error);
    next();
  }
};

module.exports = cacheMiddleware;
