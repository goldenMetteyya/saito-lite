
    this.importStrategyCard("imperial", {
      name     			:       "Imperial",
      rank			:	8,
      img			:	"/imperium/img/strategy/EMPIRE.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.game.state.round_scoring = 1;

        if (imperium_self.game.player == player) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.playerScoreVictoryPoints(function(vp, objective) {
            imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
            imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
            if (vp > 0) {
              imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
            }
            imperium_self.endTurn();
          }, 1);
        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        imperium_self.playerScoreVictoryPoints(function(vp, objective) {
          if (vp > 0) {
            imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
          }
          imperium_self.updateState("You have played the Imperial Secondary");
          imperium_self.endTurn();
        }, 2);

      },
    });
