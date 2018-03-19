# Notify lab seminar presenters to Slack regularly

## How to install

1.  Add `client_secret.json` to `config` folder.
    * https://developers.google.com/sheets/quickstart/nodejs?hl=ko
1.  `node auth_setting` will authorize your access
1.  `npm install -g swagger`
1.  open port 10010
    * `sudo iptables -I INPUT 1 -p tcp --dport 10010 -j ACCEPT`
1.  `swagger project start`
1.  Run scheduler: `node scheduler.js`

## ETC info

* Design REST API documentation: `swagger project edit`
* Start REST service: `swagger project start`
* See REST documentation: `http://localhost:10010/docs/`
* How to open port in Ubuntu: http://server-engineer.tistory.com/418
* tmux
  * `tmux new -s presenter-service`
  * `tmux attach -t presenter-service`
