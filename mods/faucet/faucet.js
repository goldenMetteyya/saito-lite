const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate.js');
const Big = require('big.js');

const Modal = require('../../lib/ui/modal/modal');
const FaucetModalCaptchaTemplate = require('./lib/modal/faucet-modal-captcha.template');
const FaucetModalRegistryTemplate = require('./lib/modal/faucet-modal-registry.template');
const FaucetModalSocialTemplate = require('./lib/modal/faucet-modal-social.template');
const FaucetModalBackupTemplate = require('./lib/modal/faucet-modal-backup.template');

const FaucetAppSpace = require('./lib/email-appspace/faucet-appspace');

class Faucet extends ModTemplate {
    constructor(app) {

        super(app);

        this.name = "Faucet";
        this.initial = 10;
        this.payoutRatio = 0.75;

    }




  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
          obj.render = this.renderEmail;
          obj.attachEvents = this.attachEventsEmail;
      return obj;
    }
    return null;
  }
  renderEmail(app, data) {
     data.faucet = app.modules.returnModule("Faucet");
     FaucetAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
     data.faucet = app.modules.returnModule("Faucet");
     FaucetAppspace.attachEvents(app, data);
  }




    onConfirmation(blk, tx, conf, app) {

        if (app.BROWSER == 1) { return; }

        if (conf == 0) {
            if (tx.transaction.type == 0) {
                if (this.app.BROWSER == 1) { return; }
                this.updateUsers(tx);
            }
        }
    }

    async updateUsers(tx) {
        try {
            if (tx.transaction.type >= -999) {
                for (let ii = 0; ii < tx.transaction.from.length; ii++) {
                    if (tx.transaction.from[ii].type >= -999) {
                        if (tx.transaction.from[ii].add != this.app.wallet.returnPublicKey()) {
                            let sql = "SELECT * FROM users where address = $address";
                            let params = {
                                $address: tx.transaction.from[ii].add
                            };
                            let rows = await this.app.storage.queryDatabase(sql, params, "faucet");
                            if (rows.length == 0) {
                                this.addUser(tx, ii);
                            } else {
                                for (let j = 0; j < rows.length; j++) {
                                    if (rows[j].address == tx.transaction.from[ii].add) {
                                        this.updateUser(rows[j], tx, ii);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async updateUser(row, tx, ii) {
        let sql = "";
        let params = {};
        var payout = ((row.total_spend / (row.total_payout + 0.01)) >= this.payoutRatio);
        var newPayout = Math.ceil( row.last_payout_amt / this.payoutRatio );
        var isGame = 0;
        if (typeof tx.transaction.msg.game_id != "undefined") { isGame = 1 };
        var gameOver = 0;
        if (tx.name == "game over") { gameOver = 1 };
        if (payout == true) {
            params = {
                $address: row.address,
                $last_payout_ts: tx.ts,
                $last_payout_amt: newPayout,
                $total_payout: row.total_payout + newPayout,
                $tx_count: row.tx_count + 1,
                $games_finished: row.games_finished + gameOver,
                $game_tx_count: row.game_tx_count + isGame,
                $latest_tx: tx.transaction.ts,
                $total_spend: row.total_spend + Number(tx.fees_total)
            }
            sql = `UPDATE users SET last_payout_ts = $last_payout_ts, last_payout_amt = $last_payout_amt, total_payout = $total_payout, tx_count = $tx_count, games_finished = $games_finished, game_tx_count = $game_tx_count, latest_tx = $latest_tx, total_spend = $total_spend WHERE address = $address`

        } else {
            params = {
                $address: row.address,
                $tx_count: row.tx_count + 1,
                $games_finished: row.games_finished + gameOver,
                $game_tx_count: row.game_tx_count + isGame,
                $latest_tx: tx.transaction.ts,
                $total_spend: row.total_spend + Number(tx.fees_total)
            }
            sql = `UPDATE users SET last_payout_ts = $last_payout_ts, tx_count = $tx_count, games_finished = $games_finished, game_tx_count = $game_tx_count, latest_tx = $latest_tx, total_spend = $total_spend WHERE address = $address`
        }
        let resp = await this.app.storage.executeDatabase(sql, params, "faucet");

        if (payout) {
            this.makePayout(row.address, newPayout);
        }

    }


    async addUser(tx, ii) {
        try{
            //let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ($address, $tx_count, $games_finished, $game_tx_count, $first_tx, $latest_tx, $last_payout_ts, $last_payout_amt, $total_payout, $total_spend, $referer);"
            var isGame = 0;
            if (typeof tx.transaction.msg.game_id != undefined) { isGame = 1 };
            let params = {
                $address: tx.transaction.from[ii].add,
                $tx_count: 1,
                $games_finished: 0,
                $game_tx_count: isGame,
                $first_tx: tx.transaction.ts,
                $latest_tx: tx.transaction.ts,
                $last_payout_ts: tx.transaction.ts,
                $last_payout_amt: this.initial,
                $total_payout: this.initial,
                $total_spend: Number(tx.fees_total),
                $referer: '',
            }
            let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ('"+tx.transaction.from[ii].add+"', "+1+", "+0+", "+isGame+", "+tx.transaction.ts+", "+tx.transaction.ts+", "+tx.transaction.ts+", "+this.initial+", "+this.initial+", "+Number(tx.fees_total)+", '');";
            params = {};

            await this.app.storage.executeDatabase(sql, params, "faucet");

            //initial funds sent
            this.makePayout(tx.transaction.from[ii].add, this.initial);

            return;
        } catch (err) {
            console.error(err);
        }
    }

    async makePayout(address, amount) {
        //send the user a little something.

        let wallet_balance = this.app.wallet.returnBalance();

        if (wallet_balance < amount) {
          console.log("\n\n\n *******THE FAUCET IS POOR******* \n\n\n");
          return;
        }

        try {

          let faucet_self = this;
          let total_fees = Big(amount+2);
          let newtx = new saito.transaction();
          newtx.transaction.from = faucet_self.app.wallet.returnAdequateInputs(total_fees.toString());
          newtx.transaction.ts   = new Date().getTime();

          //console.log("FAUCET INPUTS: " + JSON.stringify(faucet_self.app.wallet.wallet.inputs));

          // add change input
          var total_inputs = Big(0.0);
          for (let i = 0; i < newtx.transaction.from.length; i++) {
            total_inputs = total_inputs.plus(Big(newtx.transaction.from[i].amt));
          }

          //
          // generate change address(es)
          //
          var change_amount = total_inputs.minus(total_fees);

          // break up payment into many slips if large
          var chunks = Math.floor(amount/100);
          var remainder = amount % 100;

          for (let i = 0; i < chunks; i++) {
            newtx.transaction.to.push(new saito.slip(address, Big(100.0)));
            newtx.transaction.to[newtx.transaction.to.length-1].type = 0;
          }
          newtx.transaction.to.push(new saito.slip(address, Big(remainder)));
            newtx.transaction.to[newtx.transaction.to.length-1].type = 0;

          if (Big(change_amount).gt(0)) {
            newtx.transaction.to.push(new saito.slip(faucet_self.app.wallet.returnPublicKey(), change_amount.toFixed(8)));
            newtx.transaction.to[newtx.transaction.to.length-1].type = 0;
          }

          newtx.transaction.msg.module    = "Email";
          newtx.transaction.msg.title     = "Saito Faucet - You have been Rewarded";
          newtx.transaction.msg.message   = 'You have received ' + amount + ' tokens from our Saito faucet.';
          newtx = this.app.wallet.signTransaction(newtx);

          this.app.network.propagateTransaction(newtx);
          return;

        } catch(err) {
          console.log("ERROR CAUGHT IN FAUCET: ", err);
          return;
        }

    }

    tutorialModal() {
        //
        // initial modal state
        //
        let modal = new Modal(this.app, {
            id: 'faucet',
            title: 'Welcome to Saito',
            content: FaucetModalBackupTemplate()
        });

        modal.render("blank");

        if (document.querySelector('.tutorial-skip')) {
            document.querySelector('.tutorial-skip')
                .onclick = () => modal.destroy();
        }
        // const showRegistryModal = (are_tokens_sent=true) => {
        //     modal.destroy();
        //     modal.title = "Register a Username";
        //     modal.content = FaucetModalRegistryTemplate(are_tokens_sent);

        //     modal.render();
        //     modal.attachEvents(registryModalEvents);
        // }
        /*
        const socialModalEvents = () => {
            let backup_button = document.getElementById('registry-backup-wallet');
            backup_button.onclick = () => {
                var pom = document.createElement('a');
                pom.setAttribute('type', "hidden");
                pom.setAttribute('href', 'data:application/json;utf-8,' + encodeURIComponent(JSON.stringify(this.app.options)));
                pom.setAttribute('download', "saito.wallet.json");
                document.body.appendChild(pom);
                pom.click();
                pom.remove();
            };
        }

        const showSocialModal = (are_tokens_sent=true) => {
            modal.destroy();
            modal.title = 'Explore Saito'
            modal.content = FaucetModalSocialTemplate(are_tokens_sent);
            modal.render();
            modal.attachEvents(socialModalEvents);
        }

        const registryModalEvents = () => {
            let registry_input = document.getElementById('registry-input')
            registry_input.onfocus = () => registry_input.placeholder = '';
            registry_input.onblur = () => registry_input.placeholder = 'Username';

            var idTimeout;
            var invalidID;

            registry_input.onkeypress = () => {
                clearTimeout(idTimeout);

                registry_input.classList.remove('red-bottom-border');
                registry_input.classList.remove('green-bottom-border');

                idTimeout = setTimeout(async () => {
                    let identifier = `${registry_input.value}@saito`;
                    let id_response = await this.app.keys.fetchPublicKeyPromise(identifier);

                    if (id_response.rows.length == 0) {
                        // return green checkmark
                        registry_input.classList.remove('red-bottom-border');
                        registry_input.classList.add('green-bottom-border');
                        invalidID = false;
                    } else {
                        // give red mark
                        registry_input.classList.remove('green-bottom-border');
                        registry_input.classList.add('red-bottom-border');
                        invalidID = true;
                    }
                }, 1000);
            }

            document.getElementById('registry-add-button').onclick = () => {
                if (invalidID) { salert("Please regsiter an ID that isn't taken"); return;}

                let identifier = document.getElementById('registry-input').value
                let registry_success = this.app.modules.returnModule("Registry").registerIdentifier(identifier);

                if (registry_success) {
                    Array.from(document.getElementsByClassName('saito-identifier'))
                        .forEach(elem => {
                            elem.innerHTML = `<h3>${identifier}@saito</h3>`
                        });
                    //
                    // TODO: Add email capture and links to discord and Telegram
                    //
                    showSocialModal(true);
                }
            };

            document.querySelector('.tutorial-skip')
                    .onclick = () => showSocialModal(false);
        }

        modal.attachEvents(registryModalEvents);


        const captchaCallback = () => {
            //
            // TODO: SEND TOKENS WITH FAUCET HERE
            //
            // send out faucet request for tokens
            //
            document.getElementById('registry-add-button').disabled = false;
        }

        //
        // captcha rendering for first modal
        grecaptcha.render("recaptcha", {
            sitekey: '6Lc18MYUAAAAAKb0_kFKkhA1ebdPu_hLmyyRo3Cd',
            callback: captchaCallback
        });
        */
    }

    shouldAffixCallbackToModule() { return 1; }

}

module.exports = Faucet;
