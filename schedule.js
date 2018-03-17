var fetch = require('node-fetch');
var schedule = require('node-schedule');

var j = schedule.scheduleJob('0 9 */3 * *', function() {
  fetch('http://localhost:10010/slack', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(json => console.log(json));
});
