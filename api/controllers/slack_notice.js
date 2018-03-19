var get_presenters = require('./get_presenters');
var Slack = require('slack-node');

webhookUri =
  'https://hooks.slack.com/services/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';

slack = new Slack();
slack.setWebhook(webhookUri);

function slack_notice(req, res) {
  get_presenters()
    .then(function(presenter_info) {
      const now = Date.now();

      const newArray = presenter_info.filter(element => {
        let resultBool = true;
        const d = Date.parse(element.date);
        if (d - now < 0) {
          resultBool = false;
        }
        return resultBool;
      });

      // console.log(newArray);
      return newArray;
    })
    .then(presenters => {
      let output_text = '';
      presenters.forEach(presenter => {
        output_text +=
          'Date: ' +
          presenter.date +
          ', Type: ' +
          presenter.type +
          ', Name: ' +
          presenter.name +
          '\n';
      });
      console.log(output_text);
      slack.webhook(
        {
          channel: '#labseminar',
          username: 'lab-seminar-bot',
          text: output_text,
        },
        function(err, response) {
          console.log(response);
          res.status(201).send({ result: 'Success' });
        }
      );
    });
}

module.exports = {
  slack_notice: slack_notice,
};
