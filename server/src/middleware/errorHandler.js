export function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose validation failure (e.g. required field missing)
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // MongoDB duplicate-key error (e.g. a slug that already exists)
  if (err.code === 11000) {
    return res.status(400).json({ error: "That value must be unique (e.g. slug) and already exists." });
  }

  res.status(500).json({ error: "Something went wrong" });
}