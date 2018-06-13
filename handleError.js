function handleError(err, res) {
  console.log('err:', err);
  res.status(500).json(err);
}

module.exports = handleError;
