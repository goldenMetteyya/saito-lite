const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const EmailMain = require('./lib/email-main/email-main');

// external dependency
const numeral = require('numeral');

class Email extends ModTemplate {

  constructor(app) {
    super(app);

    this.name 		= "Email";
    this.chat 		= null;

    this.emails 	      = {};
    this.emails.inbox 	= [];
    this.emails.sent 	  = [];
    this.emails.trash 	= [];
    this.emails.active  = "inbox";  	// inbox
				// outbox
				// trash

    this.mods   	= [];

    this.uidata		= {};

  }

  initialize(app) {
 
    //
    // add an email
    //
    this.emails.inbox.push({
      sig: "1",
      title: "New Email",
      message: "This is a new email, just for you!",
      timestamp: new Date().getTime(),
    });
    this.emails.sent.push({
      sig: "2",
      title: "Sent Email",
      message: "This is an email we have recently sent.",
      timestamp: new Date().getTime(),
    });
    this.emails.trash.push({
      sig: "3",
      title: "Deleted Email",
      message: "This is an email that we have deleted.",
      timestamp: new Date().getTime(),
    });


    //
    // what does this do? function names do not adequately indicate purpose 
    //
    this.mods = this.app.modules.implementsKeys([
      'afterRender',
      'returnHTML',
      'returnButtonHTML',
    ]);

  }


  initializeHTML(app) {

    this.uidata.mods	  = this.mods;
    this.uidata.parentmod = this;

    //
    // add all HTML elements to DOM
    //
    EmailMain.render(app, this.uidata);
    EmailMain.attachEvents(app, this.uidata);

    //
    // update chat module
    //
    //let chatManager = app.modules.returnModule("Chat");
    //this.chat = chatManager.respondTo("email");

  }



  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

    //
    // leaving this here for the short term,
    // token manager can be a separate module
    // in the long-term, as the email client
    // should just handle emails
    //
    //this.getTokens();

    this.app.storage.loadTransactions("Email", 50, (txs) => {

      for (let i = 0; i < txs.length; i++) {
	this.emails.inbox.unshift(txs[i].transaction.msg);
	EmailList.render(this.app, this.uidata);
	EmailList.attachEvents(this.app, this.uidata);
      }

    });

    if (this.app.BROWSER) { 
      EmailList.render(this.app, this.uidata); 
      EmailList.attachEvents(this.app, this.uidata);
    }

  }



  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let email = app.modules.returnModule("Email");

    if (conf == 0) {

      //
      // if transaction is for me
      //
      if (tx.isTo(app.wallet.returnPublicKey())) {

        //
        // great lets save this
        //
        app.storage.saveTransaction(tx);

        //
        // and update our email client
        //
        email.addEmail(tx);
      }
    }
  }


  addEmail(tx) {
    let {title, message} = tx.returnMessage();
    this.emails.inbox.unshift({title, message, timestamp: tx.transaction.ts});
    if (this.app.BROWSER) { EmailList.render(this.app, this.uidata); }
  }


  getTokens() {
    let msg = {};
    msg.data = {address: this.app.wallet.returnPublicKey()};
    msg.request = 'get tokens';
    setTimeout(() => {
        this.app.network.sendRequest(msg.request, msg.data);
    }, 1000);
  }

  updateBalance() {
/**
    if (this.app.BROWSER) {
      document.querySelector('.email-balance').innerHTML
        = numeral(this.app.wallet.returnBalance()).format('0,0.0000');
    }
***/
  }

}

module.exports = Email;