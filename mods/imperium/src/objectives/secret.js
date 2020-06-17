  
  this.importSecretObjective('establish-a-blockade', {
      name 		: 	"Establish a Blockade" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in the same sector as an opponent's spacedock",
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {

	for (let i in this.game.board) {
	  let sector = this.game.board[i].tile;
	  if (this.doesSectorContainPlayerShip(player, sector) {
	    if (this.doesSectorContainNonPlayerUnit(player, sector, "spacedock")) {
	      return 1;
	    }
	  }
	}

	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });




  this.importSecretObjective('galactic-observer', {
      name 		: 	"Galactic Observer" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in 6 different sectors" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let ships_in_systems = 0;
	for (let i in this.game.board) {
	  let sector = this.game.board[i].tile;
	  if (this.doesSectorContainPlayerShip(player, sector) {
	    ships_in_systems++;
	  }
	}

	if (ships_in_systems > 5) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });



  this.importSecretObjective('master-of-the-ion-cannon', {
      name 		: 	"Master of the Ion Cannon" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 4 PDS units in play" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let pds_units_in_play = 0;

	for (let i in this.game.planets) {
	  let planet = this.game.planets[i];
	  for (let ii = 0; ii < planet.units[player-1].length; ii++) {
	    if (planet.units[player-1][ii].type == "pds") {
	      pds_units_in_play++;
	    }
	  }
	}

	if (pds_units_in_play > 3) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });


  this.importSecretObjective('war-engine', {
      name 		: 	"War Engine" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have three spacedocks in play" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let docks_in_play = 0;

	for (let i in this.game.planets) {
	  let planet = this.game.planets[i];
	  for (let ii = 0; ii < planet.units[player-1].length; ii++) {
	    if (planet.units[player-1][ii].type == "spacedock") {
	      docks_in_play++;
	    }
	  }
	}

	if (docks_in_play > 2) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });

/***
  this.importSecretObjective('wormhole-administrator', {
      name 		: 	"Wormhole Administrator" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in asystems containing alpha and beta wormholes respectively" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('fleet-of-terror', {
      name 		: 	"Fleet of Terror" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have five dreadnaughts in play" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('act-of-espionage', {
      name 		: 	"Act of Espionage" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Discard 5 action cards from your hard" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('cultural-diplomacy', {
      name 		: 	"Cultural Diplomacy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Control at least 4 cultural planets" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('space-to-breathe', {
      name 		: 	"Space to Breathe" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in 3 systems with no planets" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('ascendant-technocracy', {
      name 		: 	"Ascendant Technocracy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Research 4 tech upgrades on the same color path" , 
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('penal-colonies', {
      name 		: 	"Penal Colonies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Control four planets with hazardous conditions" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('master-of-production', {
      name 		: 	"Master of Production" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Control four planets with industrial civilizations" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('faction-technologies', {
      name 		: 	"Faction Technologies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Research 2 faction technologies" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('occupy-new-byzantium', {
      name 		: 	"Occupy New Byzantium" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Control New Byzantium and have at least 3 ships protecting the sector" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('cast-a-long-shadow', {
      name 		: 	"Cast a Long Shadow" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in a system adjacent to an opponent homeworld" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });


  this.importSecretObjective('military-catastrophe', {
      name 		: 	"Military Catastrophe" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Destroy the flagship of another player" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('nuke-them-from-orbit', {
      name 		: 	"Nuke them from Orbit" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Destroy the last of a player's ground forces using bombardment" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('anti-imperialism', {
      name 		: 	"Anti-Imperialism" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Achieve victory in combat with a player with the most VP" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('close-the-trap', {
      name 		: 	"Close the Trap" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Destroy another player's last ship in a system using a PDS" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });
  this.importSecretObjective('flagship-dominance', {
      name 		: 	"" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Achieve victory in a space combat in a system containing your flagship. Your flagship must survive this combat" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 0;
      },
      scoreObjective : function(imperium_self, player) { 
	return 1;
      }
  });

***/
