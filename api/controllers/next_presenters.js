var util = require('util');

function next_presenters(req, res) {
  var period = req.swagger.params.period.value || 1;
  var result = util.format('Hello, %d!', period);
  res.json(result);
}

module.exports = {
  next_presenters: next_presenters,
};
