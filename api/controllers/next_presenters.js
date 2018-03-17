var util = require('util');
var get_presenters = require('./get_presenters');

function next_presenters(req, res) {
  var period = req.swagger.params.period.value || 1;
  get_presenters().then(function(presenter_info) {
    const now = Date.now();
    const week = period * 7 * 24 * 60 * 60 * 1000;

    const newArray = presenter_info.filter(element => {
      let resultBool = true;
      const d = Date.parse(element.date);
      if (d - now < 0) {
        resultBool = false;
      } else if (d > now + week) {
        resultBool = false;
      }
      return resultBool;
    });

    console.log(JSON.stringify(presenter_info));
    console.log(JSON.stringify(newArray));

    res.json(newArray);
  });
}

module.exports = {
  next_presenters: next_presenters,
};
