  
  returnPlayers(num=0) {
  
    var players = [];

    let factions = JSON.parse(JSON.stringify(this.returnFactions()));

    for (let i = 0; i < num; i++) {
  
      if (i == 0) { col = "color1"; }
      if (i == 1) { col = "color2"; }
      if (i == 2) { col = "color3"; }
      if (i == 3) { col = "color4"; }
      if (i == 4) { col = "color5"; }
      if (i == 5) { col = "color6"; }
  
      var keys = Object.keys(factions);
      let rf = keys[this.rollDice(keys.length)-1];
      delete factions[rf];
  
      players[i] = {};
      players[i].can_intervene_in_action_card = 0;
      players[i].action_cards_per_round = 4;
      players[i].new_tokens_per_round = 2;
      players[i].command_tokens  	= 3;
      players[i].strategy_tokens 	= 2;
      players[i].fleet_supply    	= 3;
      players[i].fleet_supply_limit    	= 16;
      players[i].faction 		= rf;
      players[i].homeworld		= "";
      players[i].color   		= col;
      players[i].goods			= 20;
      players[i].commodities		= 3;
      players[i].commodity_limit	= 3;
      players[i].vp			= 0;
      players[i].passed			= 0;
      players[i].action_card_limit      = 7;
      players[i].strategy_cards_played = [];
      players[i].action_cards_played = [];
      players[i].objectives_scored = [];

  
      //
      // gameplay modifiers (action cards + tech)
      //
      players[i].new_token_bonus_when_issued = 0;
      players[i].action_cards_bonus_when_issued = 0;
      players[i].new_tokens_bonus_when_issued = 0;
      players[i].fleet_move_bonus = 0;
      players[i].ship_move_bonus = 0;
      players[i].fly_through_asteroids = 0;
      players[i].reinforce_infantry_after_successful_ground_combat = 0;
      players[i].bacterial_weapon = 0;
      players[i].evasive_bonus_on_pds_shots = 0;
      players[i].perform_two_actions = 0;
      players[i].move_through_sectors_with_opponent_ships = 0;
      players[i].assign_pds_hits_to_non_fighters = 0;
      players[i].reallocate_four_infantry_per_round = 0;
      players[i].may_produce_after_gaining_planet = 0;
      players[i].extra_roll_on_bombardment_or_pds = 0;
      players[i].stasis_on_opponent_combat_first_round = 0;
      players[i].may_repair_damaged_ships_after_space_combat = 0;
      players[i].may_assign_first_round_combat_shot = 0;
      players[i].production_bonus = 0;
      players[i].may_player_produce_without_spacedock = 0;
      players[i].may_player_produce_without_spacedock_production_limit = 0;
      players[i].may_player_produce_without_spacedock_cost_limit = 0;

      //
      // must target certain units when assigning hits, if possible
      //
      players[i].target_units = [];
      players[i].planets_conquered_this_turn = [];


      //
      // faction-inspired gameplay modifiers 
      //
      players[i].deep_space_conduits = 0; // treat all systems adjacent to activated system
      players[i].resupply_stations = 0; // gain trade goods on system activation if contains ships 
      players[i].turn_nullification = 0; // after player activates system with ships, can end turn ...
 
      //
      // roll modifiers
      //
      players[i].space_combat_roll_modifier 	= 0;
      players[i].ground_combat_roll_modifier 	= 0;
      players[i].pds_combat_roll_modifier 	= 0;
      players[i].space_combat_roll_bonus_shots 	= 0;
      players[i].ground_combat_roll_bonus_shots	= 0;
      players[i].pds_combat_roll_bonus_shots 	= 0;
      players[i].ground_combat_dice_reroll      = 0;
      players[i].space_combat_dice_reroll       = 0;
      players[i].pds_combat_dice_reroll		= 0;
      players[i].combat_dice_reroll_permitted 	= 0;

      //
      // tech upgrades
      //
      players[i].temporary_green_tech_prerequisite = 0;
      players[i].temporary_yellow_tech_prerequisite = 0;
      players[i].temporary_red_tech_prerequisite = 0;
      players[i].temporary_blue_tech_prerequisite = 0;
      players[i].permanent_green_tech_prerequisite = 0;
      players[i].permanent_yellow_tech_prerequisite = 0;
      players[i].permanent_red_tech_prerequisite = 0;
      players[i].permanent_blue_tech_prerequisite = 0;
      players[i].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;
      players[i].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;

      if (i == 1) { players[i].color   = "yellow"; }
      if (i == 2) { players[i].color   = "green"; }
      if (i == 3) { players[i].color   = "blue"; }
      if (i == 4) { players[i].color   = "purple"; }
      if (i == 5) { players[i].color   = "black"; }
  
      players[i].planets = [];		
      players[i].tech = [];
      players[i].tech_exhausted_this_turn = [];
      players[i].upgrades = [];
      players[i].strategy = [];		// strategy cards  

      // scored objectives
      players[i].scored_objectives = [];
      players[i].secret_objectives = [];
  
    }
  
    return players;
  
  }
  
  
  





  playerTurn(stage="main") {
  
    let html = '';
    let imperium_self = this;
    let technologies = this.returnTechnology();

    if (stage == "main") {
  
      let playercol = "player_color_"+this.game.player;
  
      let html  = '<div class="terminal_header">[command: '+this.game.players_info[this.game.player-1].command_tokens+'] [strategy: '+this.game.players_info[this.game.player-1].strategy_tokens+'] [fleet: '+this.game.players_info[this.game.player-1].fleet_supply+'] [commodities: '+this.game.players_info[this.game.player-1].commodities+'] [trade goods: '+this.game.players_info[this.game.player-1].goods+'] [player: '+this.game.player+']</div>';
          html  += '<p style="margin-top:20px"></p>';
          html  += '<div class="terminal_header2"><div class="player_color_box '+playercol+'"></div>' + this.returnFaction(this.game.player) + ":</div><p><ul class='terminal_header3'>";
      if (this.game.players_info[this.game.player-1].command_tokens > 0) {
        html += '<li class="option" id="activate">activate system</li>';
      }
      if (this.canPlayerPlayStrategyCard(this.game.player) == 1) {
        html += '<li class="option" id="select_strategy_card">play strategy card</li>';
      }
      if (this.tracker.action_card == 0 && this.canPlayerPlayActionCard(this.game.player) == 1) {
        html += '<li class="option" id="action">play action card</li>';
      }
      if (this.tracker.trade == 0 && this.canPlayerTrade(this.game.player) == 1) {
        html += '<li class="option" id="trade">send trade goods</li>';
      }

      //
      // add tech and factional abilities
      //
      let tech_attach_menu_events = 0;
      let tech_attach_menu_triggers = [];
      let tech_attach_menu_index = [];


      let z = this.returnEventObjects();
      for (let i = 0; i < z.length; i++) {
	if (z[i].menuOptionTriggers(this, "main", this.game.player) == 1) {
          let x = z[i].menuOption(this, "main", this.game.player);
	  html += x.html;
	  tech_attach_menu_index.push(i);
	  tech_attach_menu_triggers.push(x.event);
	  tech_attach_menu_events = 1;
	}
      }
  
      if (this.canPlayerPass(this.game.player) == 1) {
        html += '<li class="option" id="pass">pass</li>';
      }
      html += '</ul></p>';
  
      this.updateStatus(html);
  
      $('.option').on('click', function() {
  
        let action2 = $(this).attr("id");

        //
        // respond to tech and factional abilities
        //
        if (tech_attach_menu_events == 1) {
	  for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	    if (action2 == tech_attach_menu_triggers[i]) {
              $(this).remove();
              z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "main", imperium_self.game.player);
	      return;
	    }
	  }
        }

        if (action2 == "activate") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerActivateSystem();
        }

        if (action2 == "select_strategy_card") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerSelectStrategyCard(function(success) {
  	    imperium_self.addMove("strategy_card_after\t"+success+"\t"+imperium_self.game.player+"\t1");
  	    imperium_self.addMove("strategy\t"+success+"\t"+imperium_self.game.player+"\t1");
  	    imperium_self.addMove("strategy_card_before\t"+success+"\t"+imperium_self.game.player+"\t1");
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "action") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerSelectActionCard(function(card) {
  	    imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	    imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
  	    imperium_self.endTurn();
          }, function() { imperium_self.playerTurn(); }, 
	    ["action"]);
        }
        if (action2 == "trade") {
          imperium_self.playerTrade(function() {
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "pass") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.addMove("pass\t"+imperium_self.game.player);
          imperium_self.endTurn();
        }
      });
    }
  }

  playerPlayActionCardMenu(action_card_player, card, action_cards_played=[]) {

    let imperium_self = this;

    for (let i = 0; i < this.game.deck[1].hand.length; i++) {
      if (this.game.deck[1].hand[i].indexOf("sabotage") > -1) {
	this.game.players_info[this.game.player-1].can_intervene_in_action_card = 1;
      }
    }

    if (this.game.players_info[this.game.player-1].can_intervene_in_action_card) {

      html = '<p>Do you wish to play a countering action card? <ul>';

      if (1 == 1) {
        html += '<li class="option" id="cont">continue</li>';
      }
      if (1 == 1) {
        html += '<li class="option" id="action">action card</li>';
      }

      let tech_attach_menu_events = 0;
      let tech_attach_menu_triggers = [];
      let tech_attach_menu_index = [];

      let z = this.returnEventObjects();
      for (let i = 0; i < z.length; i++) {
        if (z[i].menuOptionTriggers(this, "action_card", this.game.player) == 1) {
          let x = z[i].menuOption(this, "action_card", this.game.player);
          html += x.html;
  	  tech_attach_menu_index.push(i);
	  tech_attach_menu_triggers.push(x.event);
	  tech_attach_menu_events = 1;
        }
      }
      html += '</ul>';

      this.updateStatus(html);
  
      $('.option').on('click', function() {
  
        let action2 = $(this).attr("id");

        //
        // respond to tech and factional abilities
        //
        if (tech_attach_menu_events == 1) {
  	  for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	    if (action2 == tech_attach_menu_triggers[i]) {
	      $(this).remove();
	      z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "action_card", imperium_self.game.player);
            }
          }
        }

        if (action2 == "action") {
          imperium_self.playerSelectActionCard(function(card) {
            imperium_self.game.players_info[this.game.player-1].action_cards_played.push(card);
    	    imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	    imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
	    imperium_self.playerPlayActionCardMenu(action_card_player, card);
          }, function() {
	    imperium_self.playerPlayActionCardMenu(action_card_player, card);
	  }, ["action"]);
        }

        if (action2 == "cont") {
          imperium_self.endTurn();
        }
        return 0;
      });

    } else {
      this.playerAcknowledgeNotice(this.returnFaction(action_card_player) + " plays " + this.action_cards[card].name, function() {
	imperium_self.endTurn();
      });
      return 0;
    }
    
  }
  
  
  playerAcknowledgeNotice(msg, mycallback) {

    let html  = msg + "<p><ul>";
        html += '<li class="textchoice" id="confirmit">I understand...</li>';
        html += '</ul></p>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() { mycallback(); });

  }


  //
  // assign hits to my forces
  //
  playerAssignHits(attacker, defender, type, sector, details, total_hits) {

    let imperium_self = this;
    let hits_assigned = 0;
    let maximum_assignable_hits = 0;

    html = '<p>You must assign '+total_hits+' to your fleet:</p><ul>';

    if (1 == 1) {
      html += '<li class="option" id="assign">assign hits</li>';
    }
    if (1 == 1) {
      html += '<li class="option" id="action">action card</li>';
    }

    let menu_type = "";
    if (details == "pds") { menu_type = "assign_hits_pds"; }
    if (menu_type == "" && type == "space") { menu_type = "assign_hits_space"; }
    if (type == "ground") { menu_type = "assign_hits_ground"; }

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, menu_type, this.game.player) == 1) {
        let x = z[i].menuOption(this, menu_type, this.game.player);
        html += x.html;
	tech_attach_menu_index.push(i);
	tech_attach_menu_triggers.push(x.event);
	tech_attach_menu_events = 1;
      }
    }
    html += '</ul>';


    this.updateStatus(html);
  
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
	for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	  if (action2 == tech_attach_menu_triggers[i]) {
   	    let mytech = this.tech[imperium_self.game.players_info[imperium_self.game.player-1].tech[tech_attach_menu_index]];
	    z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, menu_type, imperium_self.game.player);
          }
        }
      }


      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function(card) {
  	  imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	  imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
	  imperium_self.playerPlayPDSDefense(player, attacker, sector);
        }, function() {
	  imperium_self.playerPlayPDSDefense(player, attacker, sector);
	});
      }

      if (action2 == "assign") {

	let sys = imperium_self.returnSectorAndPlanets(sector);

	let html = '';
	html += 'Assign <div style="display:inline" id="total_hits_to_assign">'+total_hits+'</div> hits:';
	html += '<ul>';

	let total_targetted_units = 0;;
	let targetted_units = imperium_self.game.players_info[imperium_self.game.player-1].target_units;
console.log("\n\n\nWe need to assign the hits to these units: " + JSON.stringify(imperium_self.game.players_info[imperium_self.game.player-1].target_units));
	
        for (let i = 0; i < sys.s.units[imperium_self.game.player-1].length; i++) {
  
	  let unit = sys.s.units[imperium_self.game.player-1][i];
	  maximum_assignable_hits++;
	  if (targetted_units.includes(unit.type)) { total_targetted_units++; }
	  html += '<li class="textchoice player_ship_'+i+'" id="'+i+'">'+unit.name;
	  if (unit.strength > 1) { 
	    html += ' <div style="display:inline" id="player_ship_'+i+'_hits">(';
	    for (let bb = 1; bb < unit.strength; bb++) { html += '*'; }
	    html += ')</div>'
	  }
	  html += '</li>';

	}
	html += '</ul>';
  

	imperium_self.updateStatus(html);
	
	$('.textchoice').off();
	$('.textchoice').on('click', function() {

	  let ship_idx = $(this).attr("id");
	  let selected_unit = sys.s.units[imperium_self.game.player-1][ship_idx];

	  if (total_targetted_units > 0) {
	    if (!targetted_units.includes(selected_unit.type)) {
	      alert("You must first assign hits to the required unit types");
	      return;
	    } else {
	      total_targetted_units--;
	    }
	  }

	  imperium_self.addMove("assign_hit\t"+attacker+"\t"+defender+"\t"+imperium_self.game.player+"\tship\t"+sector+"\t"+ship_idx+"\t0"); // last argument --> player should not assign again 


	  total_hits--;
	  hits_assigned++;

	  $('#total_hits_to_assign').innerHTML = total_hits;

	  if (selected_unit.strength > 1) {	  
	    selected_unit.strength--;

	    let ship_to_reduce = "#player_ship_"+ship_idx+'_hits';
	    let rhtml = '';
	    if (selected_unit.strength > 1) {
	      html += '(';
	      for (let bb = 1; bb < selected_unit.strength; bb++) {
	        rhtml += '*';
	      }
	      rhtml += ')';
	    }
	    $(ship_to_reduce).html(rhtml);
	  } else {
	    selected_unit.strength = 0;
	    selected_unit.destroyed = 0;
	    $(this).remove();
	  }

	  if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
	    imperium_self.updateStatus("Notifying players of hits assignment...");
	    imperium_self.endTurn();
	  }

	});
      }

    });
  }





  //
  // destroy units
  //
  playerDestroyShips(player, total, sector) {

    let imperium_self = this;
    let total_hits = total;
    let hits_assigned = 0;
    let maximum_assignable_hits = 0;
    let sys = imperium_self.returnSectorAndPlanets(sector);

    html = '<p>You must destroy '+total+' ships in your fleet:</p><ul>';

    let total_targetted_units = 0;;
    let targetted_units = imperium_self.game.players_info[imperium_self.game.player-1].target_units;

    for (let i = 0; i < sys.s.units[imperium_self.game.player-1].length; i++) {
      let unit = sys.s.units[imperium_self.game.player-1][i];
      maximum_assignable_hits++;
      if (targetted_units.includes(unit.type)) { total_targetted_units++; }
      html += '<li class="textchoice player_ship_'+i+'" id="'+i+'">'+unit.name+'</li>';
    }
    html += '</ul>';
  
    if (maximum_assignable_hits == 0) {
      this.addMove("notify\t" + this.returnFaction(player) + " has no ships to destroy");
      this.endTurn();
      return 0;
    }


    imperium_self.updateStatus(html);
	
    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let ship_idx = $(this).attr("id");
      let selected_unit = sys.s.units[imperium_self.game.player-1][ship_idx];

      if (total_targetted_units > 0) {
        if (!targetted_units.includes(selected_unit.type)) {
          alert("You must first destroy the required unit types");
          return;
	} else {
	  total_targetted_units--;
	}
      }

      imperium_self.addMove("destroy_unit\t"+player+"\t"+player+"\t"+"space\t"+sector+"\t"+"0"+"\t"+ship_idx+"\t1");

      selected_unit.strength = 0;;
      selected_unit.destroyed = 0;
      $(this).remove();

      total_hits--;
      hits_assigned++;

      if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
        imperium_self.updateStatus("Notifying players of hits assignment...");
        imperium_self.endTurn();
      }

    });
  }








  //
  // reaching this implies that the player can choose to fire / not-fire
  //
  playerPlaySpaceCombat(attacker, defender, sector) {
 
    let imperium_self = this;
    let sys = this.returnSectorAndPlanets(sector);
    let html = '';

    html = '<p>Space Combat: round ' + this.game.state.space_combat_round + '</p><ul>';

    if (1 == 1) {
      html += '<li class="option" id="attack">roll dice</li>';
    }
    if (1 == 1) {
      html += '<li class="option" id="action">action card</li>';
    }

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, "space_combat", this.game.player) == 1) {
        let x = z[i].menuOption(this, "space_combat", this.game.player);
        html += x.html;
	tech_attach_menu_index.push(i);
	tech_attach_menu_triggers.push(x.event);
	tech_attach_menu_events = 1;
      }
    }
    html += '</ul>';

    this.updateStatus(html);
  
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
	for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	  if (action2 == tech_attach_menu_triggers[i]) {
	    $(this).remove();
	    z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat", imperium_self.game.player);
          }
        }
      }

      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function(card) {
  	  imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	  imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
	  imperium_self.playerPlaySpaceCombat(attacker, defender, sector);
        }, function() {
	  imperium_self.playerPlaySpaceCombat(attacker, defender, sector);
	});
      }

      if (action2 == "attack") {
	// prepend so it happens after the modifiers
	//
	// ships_fire needs to make sure it permits any opponents to fire...
	//
        imperium_self.prependMove("ships_fire\t"+attacker+"\t"+defender+"\t"+sector);
	imperium_self.endTurn();
      }

    });
  }







  //
  // reaching this implies that the player can choose to fire / not-fire
  //
  playerPlayGroundCombat(attacker, defender, sector, planet_idx) { 

    let imperium_self = this;
    let sys = this.returnSectorAndPlanets(sector);
    let html = '';

    let attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
    let defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

this.updateLog("ATTACKER PPGC: " + attacker_forces);
this.updateLog("DEFENDER PPGC: " + defender_forces);


    if (this.game.player == attacker) {
      html = '<p>You are invading ' + sys.p[planet_idx].name + ' with ' + attacker_forces + ' infantry. ' +this.returnFaction(defender) + ' has ' + defender_forces + ' infanty remaining. This is round ' + this.game.state.ground_combat_round + ' of ground combat. </p><ul>';
    } else {
      html = '<p>' + this.returnFaction(attacker) + ' has invaded ' + sys.p[planet_idx].name + ' with ' + attacker_forces + ' infantry. You have ' + defender_forces + ' infantry remaining. This is round ' + this.game.state.ground_combat_round + ' of ground combat. </p><ul>';
    }

    if (1 == 1) {
      html += '<li class="option" id="attack">roll dice</li>';
    }
    if (1 == 1) {
      html += '<li class="option" id="action">action card</li>';
    }

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, "ground_combat", this.game.player) == 1) {
        let x = z[i].menuOption(this, "ground_combat", this.game.player);
        html += x.html;
	tech_attach_menu_index.push(i);
	tech_attach_menu_triggers.push(x.event);
	tech_attach_menu_events = 1;
      }
    }
    html += '</ul>';

    this.updateStatus(html);
  
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
	for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	  if (action2 == tech_attach_menu_triggers[i]) {
	    $(this).remove();
	    z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "ground_combat", imperium_self.game.player);
          }
        }
      }

      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function(card) {
  	  imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	  imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
	  imperium_self.playerPlayGroundCombat(attacker, defender, sector, planet_idx);
        }, function() {
	  imperium_self.playerPlayGroundCombat(attacker, defender, sector, planet_idx);
	});
      }

      if (action2 == "attack") {
	// prepend so it happens after the modifiers
	//
	// ships_fire needs to make sure it permits any opponents to fire...
	//
        imperium_self.prependMove("infantry_fire\t"+attacker+"\t"+defender+"\t"+sector+"\t"+planet_idx);
	imperium_self.endTurn();
      }

    });
  }







  //
  // reaching this implies that the player can choose to fire / not-fire
  //
  playerPlayPDSDefense(player, attacker, sector) {

    let imperium_self = this;
    let html = '';

    html = '<p>Do you wish to fire your PDS?</p><ul>';

    if (1 == 1) {
      html += '<li class="option" id="skip">skip PDS</li>';
    }
    if (1 == 1) {
      html += '<li class="option" id="fire">fire PDS</li>';
    }
    if (1 == 1) {
      html += '<li class="option" id="action">action card</li>';
    }

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, "pds", this.game.player) == 1) {
        let x = z[i].menuOption(this, "pds", this.game.player);
        html += x.html;
	tech_attach_menu_index.push(i);
	tech_attach_menu_triggers.push(x.event);
	tech_attach_menu_events = 1;
      }
    }
    html += '</ul>';

    this.updateStatus(html);
  
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
	for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	  if (action2 == tech_attach_menu_triggers[i]) {
	    $(this).remove();
	    z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "pds", imperium_self.game.player);
          }
        }
      }


      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function(card) {
  	  imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	  imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
	  imperium_self.playerPlayPDSDefense(player, attacker, sector);
        }, function() {
	  imperium_self.playerPlayPDSDefense(player, attacker, sector);
	});
      }

      if (action2 == "skip") {
	// prepend so it happens after the modifiers
	imperium_self.endTurn();
      }

      if (action2 == "fire") {
	// prepend so it happens after the modifiers
        imperium_self.prependMove("pds_fire\t"+imperium_self.game.player+"\t"+attacker+"\t"+sector);
	imperium_self.endTurn();
      };

    });

  }


  //
  // reaching this implies that the player can choose to fire / not-fire
  //
  playerResolveDeadlockedAgenda(agenda, choices) {

    let imperium_self = this;
    let html = '';

    html = '<p>This agenda is deadlocked in the Senate. As speaker, how do you wish to resolve this Agenda: </p><ul>';
    for (let i = 0; i < choices.length; i++) {
      html += '<li class="option" id="'+i+'">'+choices[i]+'</li>';
    }
    html += '</ul>';

    this.updateStatus(html);
  
    $('.option').off();
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");

      imperium_self.addMove("resolve_agenda\t"+agenda+"\tspeaker\t"+choices[action2]);
      imperium_self.endTurn();
      return 0;

    });
  }




  //
  // reaching this implies that the player can choose to fire / not-fire
  //
  playerPlayPreAgendaStage(player, agenda, agenda_idx) {

    let imperium_self = this;
    let html = '';

    html = '<p>Do you wish to take action before voting on this Agenda: </p><ul>';

    if (1 == 1) {
      html += '<li class="option" id="skip">proceed to vote</li>';
    }
    if (1 == 1) {
      html += '<li class="option" id="action">action card</li>';
    }

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, "agenda", this.game.player) == 1) {
        let x = z[i].menuOption(this, "agenda", this.game.player);
        html += x.html;
	tech_attach_menu_index.push(i);
	tech_attach_menu_triggers.push(x.event);
	tech_attach_menu_events = 1;
      }
    }
    html += '</ul>';

    this.updateStatus(html);
  
    $('.option').off();
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
	for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	  if (action2 == tech_attach_menu_triggers[i]) {
	    $(this).remove();
	    z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "agenda", imperium_self.game.player);
          }
        }
      }

      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function(card) {
  	  imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	  imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
	  imperium_self.playerPlayPreAgendaStage(player, agenda, agenda_idx);
        }, function() {
	  imperium_self.playerPlayPreAgendaStage(player, agenda, agenda_idx);
	}, ["rider"]);
      }

      if (action2 == "skip") {
	imperium_self.endTurn();
      }

    });

  }
  playerPlayPostAgendaStage(player, agenda, agenda_idx) {

    let imperium_self = this;
    let html = '';

    html = '<p>Do you wish to take action before this Agenda is written into Law: </p><ul>';

    if (1 == 1) {
      html += '<li class="option" id="skip">continue</li>';
    }
    if (1 == 1) {
      html += '<li class="option" id="action">action card</li>';
    }

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, "post_agenda", this.game.player) == 1) {
        let x = z[i].menuOption(this, "post_agenda", this.game.player);
        html += x.html;
	tech_attach_menu_index.push(i);
	tech_attach_menu_triggers.push(x.event);
	tech_attach_menu_events = 1;
      }
    }
    html += '</ul>';

    this.updateStatus(html);
  
    $('.option').off();
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
	for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	  if (action2 == tech_attach_menu_triggers[i]) {
	    $(this).remove();
	    z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "post_agenda", imperium_self.game.player);
          }
        }
      }

      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function(card) {
  	  imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	  imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
	  imperium_self.playerPlayPostAgendaStage(player, agenda, agenda_idx);
        }, function() {
	  imperium_self.playerPlayPostAgendaStage(player, agenda, agenda_idx);
	});
      }

      if (action2 == "skip") {
	imperium_self.endTurn();
      }

    });

  }



  playerContinueTurn(player, sector) {

    let imperium_self = this;
    let options_available = 0;

    //
    // check to see if any ships survived....
    //
    let playercol = "player_color_"+this.game.player;
    let html  = "<div class='player_color_box "+playercol+"'></div>" + this.returnFaction(player) + ": <ul>";

    if (this.canPlayerProduceInSector(player, sector) && this.tracker.production == 0) {
      html += '<li class="option" id="produce">produce units</li>';
      options_available++;
    }
    if (this.canPlayerInvadePlanet(player, sector) && this.tracker.invasion == 0) {
      html += '<li class="option" id="invade">invade planet</li>';
      options_available++;
    }
    if (this.canPlayerPlayActionCard(player) && this.tracker.action_card == 0) {
      html += '<li class="option" id="action">action card</li>';
      options_available++;
    }

console.log("HERE WE GO!");

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, "continue", this.game.player) == 1) {
        let x = z[i].menuOption(this, "continue", this.game.player);
        html += x.html;
        tech_attach_menu_index.push(i);
        tech_attach_menu_triggers.push(x.event);
        tech_attach_menu_events = 1;
      }
    }

console.log(" ... and done");

    html += '<li class="option" id="endturn">end turn</li>';
    html += '</ul>';
   
    this.updateStatus(html);
    $('.option').on('click', function() {

      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
        for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
          if (action2 == tech_attach_menu_triggers[i]) {
            $(this).remove();
	    z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "continue", imperium_self.game.player);
          }
        }
      }

      if (action2 == "endturn") {
        imperium_self.addMove("resolve\tplay");
        imperium_self.endTurn();
      }

      if (action2 == "produce") {
        imperium_self.addMove("continue\t"+player+"\t"+sector);
        imperium_self.playerProduceUnits(sector);
      }  

      if (action2 == "invade") {
        imperium_self.tracker.invasion = 1;
        imperium_self.playerInvadePlanet(player, sector);
      }

      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function(card) {
          imperium_self.tracker.action_card = 1;
          imperium_self.addMove("continue\t"+player+"\t"+sector);
          imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
          imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
          imperium_self.endTurn();
        }, function() {
          imperium_self.playerContinueTurn(player, sector);
          return;
	});
      }

    });

  }



  
  
  ////////////////
  // Production //
  ////////////////
  playerBuyTokens() {
  
    let imperium_self = this;

    if (this.returnAvailableInfluence(this.game.player) <= 2) {
      this.updateLog("You skip the initiative secondary, as you lack adequate influence...");
      this.updateStatus("Skipping purchase of tokens as insufficient influence...");
      this.endTurn();
      return 0;
    }
 
    let html = '<p>Do you wish to purchase any command or strategy tokens?</p> <ul>';
    html += '<li class="buildchoice textchoice" id="command">Command Tokens (<span class="command_total">0</span>)</li>';
    html += '<li class="buildchoice textchoice" id="strategy">Strategy Tokens (<span class="strategy_total">0</span>)</li>';
    html += '</ul></p>';
    html += '';
    html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0</span> influence</div>';
    html += '<div id="confirm" class="buildchoice">click here to finish</div>';
  
    this.updateStatus(html);
  

    let command_tokens = 0;
    let strategy_tokens = 0;
    let total_cost = 0;
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      if (id == "confirm") {
  
        total_cost = 3 * (command_tokens + strategy_tokens);
        imperium_self.playerSelectInfluence(total_cost, function(success) {
  
  	if (success == 1) {
            imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommand\t"+command_tokens);
            imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommand\t"+strategy_tokens);
            imperium_self.endTurn();
            return;
  	} else {
  	  alert("failure to find appropriate influence");
  	}
        });
      };
  
      //
      //  figure out if we need to load infantry / fighters
      //
      if (id == "command") 	{ command_tokens++; }
      if (id == "strategy")	{ strategy_tokens++; }
  
      let divtotal = "." + id + "_total";
      let x = parseInt($(divtotal).html());
      x++;
      $(divtotal).html(x);
  
  
  
      let resourcetxt = " resources";
      total_cost = 3 * (command_tokens + strategy_tokens);
      if (total_cost == 1) { resourcetxt = " resource"; }
      $('.buildcost_total').html(total_cost + resourcetxt);
  
    });
  
  
  }
  
  
  
  
  
  playerBuyActionCards() {
  
    let imperium_self = this;
  
    let html = '<p>Do you wish to spend 1 strategy token to purchase 2 action cards? </p><ul>';
    html += '<li class="buildchoice textchoice" id="yes">Purchase Action Cards</li>';
    html += '<li class="buildchoice textchoice" id="no">Do Not Purchase Action Cards</li>';
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      if (id == "yes") {
  
        imperium_self.addMove("DEAL\t2\t"+imperium_self.game.player+"\t2");
        imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
        imperium_self.endTurn();
        return;
  
      } else {
  
        imperium_self.endTurn();
        return;
  
      }
    });
  
  }
  
  



  playerResearchTechnology(mycallback) {
  
    let imperium_self = this;
    let html = '<p>You are eligible to upgrade to the following technologies: </p><ul>';
  
    for (var i in this.tech) {
      if (this.canPlayerResearchTechnology(i)) {
        html += '<li class="option" id="'+i+'">'+this.tech[i].name+'</li>';
      }
    }
    html += '</ul>';
  
    this.updateStatus(html);
    
    $('.option').off();
    $('.option').on('click', function() {

      //
      // handle prerequisites
      //
      imperium_self.exhaustPlayerResearchTechnologyPrerequisites(i);
      mycallback($(this).attr("id"));

    });
  
  
  }
  



  canPlayerScoreVictoryPoints(player, card="", deck=1) {
  
    if (card == "") { return 0; }
  
    let imperium_self = this;
  
    // deck 1 = primary
    // deck 2 = secondary
    // deck 3 = secret

console.log(player + " -- " + card + " -- " + deck);  

    if (deck == 1) {
      let objectives = this.returnStageIPublicObjectives();
      if (objectives[card] != "") {
        if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
      }
    }
  
    if (deck == 2) {
      let objectives = this.returnStageIIPublicObjectives();
      if (objectives[card] != "") {
        if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
      }
    }
  
    if (deck == 3) {
      let objectives = this.returnSecretObjectives();
      if (objectives[card] != "") {
        if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
      }
    }
  
    return 0;
  
  }




  playerScoreVictoryPoints(mycallback, stage=0) {  

    let imperium_self = this;
   
    let html = '';  
    if (stage == 1) { 
      html += 'You are playing the Imperium primary. ';
    }
    if (stage == 2) { 
      html += 'You are playing the Imperium secondary. ';
    }

    html += '<p>Do you wish to score any victory points? </p><ul>';
  
    // Stage I Public Objectives
    for (let i = 0; i < this.game.state.stage_i_objectives.length; i++) {
console.log("STAGE I: " + this.game.state.stage_i_objectives[i]);
      if (!this.game.players_info[this.game.player-1].objectives_scored.includes(this.game.state.stage_i_objectives[i])) {
        if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.state.stage_i_objectives[i], 1)) {
          html += '1 VP Public Objective: <li class="option stage1" id="'+this.game.state.stage_i_objectives[i]+'">'+this.game.deck[3].cards[this.game.state.stage_i_objectives[i]].name+'</li>';
        }
      }
    }
  
    // Stage II Public Objectives
    for (let i = 0; i < this.game.state.stage_ii_objectives.length; i++) {
console.log("STAGE II: " + this.game.state.stage_ii_objectives[i]);
      if (!this.game.players_info[this.game.player-1].objectives_scored.includes(this.game.state.stage_ii_objectives[i])) {
        if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.state.stage_ii_objectives[i], 2)) {
          html += '2 VP Public Objective: <li class="option stage2" id="'+this.game.state.stage_ii_objectives[i]+'">'+this.game.deck[4].cards[this.game.state.stage_ii_objectives[i]].name+'</li>';
        }
      }
    }
  
    // Secret Objectives
    for (let i = 0 ; i < this.game.deck[5].hand.length; i++) {
      if (!this.game.players_info[this.game.player-1].objectives_scored.includes(this.game.deck[5].hand[i])) {
        if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.deck[5].hand[i], 3)) {
          html += '1 VP Secret Objective: <li class="option secret3" id="'+this.game.deck[5].hand[i]+'">'+this.game.deck[5].cards[this.game.deck[5].hand[i]].name+'</li>';
        }
      }
    }
  
    html += '<li class="option" id="no">I choose not to score...</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    
    $('.option').off();
    $('.option').on('click', function() {
  
      let action = $(this).attr("id");
      let objective_type = 3;
  
      if ($(this).hasClass("stage1")) { objective_type = 1; }
      if ($(this).hasClass("stage2")) { objective_type = 2; }
      if ($(this).hasClass("secret3")) { objective_type = 3; }
  
      if (action == "no") {
  
        mycallback(0, "");
  
      } else {

        let vp = 2;
        let objective = action;
        mycallback(vp, objective);
  
      }
    });
  }
  


  
  playerBuildInfrastructure(mycallback, stage=1) {   

    let imperium_self = this;
  
    let html = '';

    if (stage == 1) { html += "<p>Which would you like to build: </p><ul>"; }
    else { html += "<p>You may also build an additional PDS: </p><ul>"; }

    html += '<li class="buildchoice" id="pds">Planetary Defense System</li>';
    if (stage == 1) {
      html += '<li class="buildchoice" id="spacedock">Space Dock</li>';
    }
    html += '</ul>';
  
    this.updateStatus(html);
  
    let stuff_to_build = [];  
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      html = "Select a planet on which to build: ";
      imperium_self.updateStatus(html);
  
      imperium_self.playerSelectPlanet(function(sector, planet_idx) {  

        if (id == "pds") {
  	  imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\tpds\t"+sector);
	  mycallback();
        }
        if (id == "spacedock") {
  	  imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\tspacedock\t"+sector);
	  mycallback();
        }
  
      }, 2);  // 2 any i control
  
    });
  
  }
  
  
  playerProduceUnits(sector, production_limit=0, cost_limit=0) { 
  
    let imperium_self = this;

    //
    // determine production_limit from sector
    //
    let sys = this.returnSectorAndPlanets(sector);
    let calculated_production_limit = 0;
    for (let i = 0; i < sys.s.units[this.game.player-1].length; i++) {
      calculated_production_limit += sys.s.units[this.game.player-1][i].production;
    }
    for (let p = 0; p < sys.p.length; p++) {
      for (let i = 0; i < sys.p[p].units[this.game.player-1].length; i++) {
        calculated_production_limit += sys.p[p].units[this.game.player-1][i].production;
      }
    }

    if (this.game.players_info[this.game.player-1].may_player_produce_without_spacedock == 1) {
      if (production_limit == 0 && this.game.players_info[this.game.player-1].may_player_produce_without_spacedock_production_limit >= 0) { production_limit = this.game.players_info[this.game.player-1].may_player_produce_without_spacedock_production_limit; }
      if (cost_limit == 0 && this.game.players_info[this.game.player-1].may_player_produce_without_spacedock_cost_limit >= 0) { cost_limit = this.game.players_info[this.game.player-1].may_player_produce_without_spacedock_cost_limit; }
    };

    if (calculated_production_limit > production_limit) { production_limit = calculated_production_limit; }


    let html = '<p>Produce Units in this Sector: ';
    if (production_limit != 0) { html += '('+production_limit+' units max)'; }
    if (cost_limit != 0) { html += '('+cost_limit+' cost max)'; }
    html += '</p><ul>';
    html += '<li class="buildchoice" id="infantry">Infantry (<span class="infantry_total">0</span>)</li>';
    html += '<li class="buildchoice" id="fighter">Fighter (<span class="fighter_total">0</span>)</li>';
    html += '<li class="buildchoice" id="destroyer">Destroyer (<span class="destroyer_total">0</span>)</li>';
    html += '<li class="buildchoice" id="carrier">Carrier (<span class="carrier_total">0</span>)</li>';
    html += '<li class="buildchoice" id="cruiser">Cruiser (<span class="cruiser_total">0</span>)</li>';
    html += '<li class="buildchoice" id="dreadnaught">Dreadnaught (<span class="dreadnaught_total">0</span>)</li>';
    html += '<li class="buildchoice" id="flagship">Flagship (<span class="flagship_total">0</span>)</li>';
    html += '<li class="buildchoice" id="warsun">War Sun (<span class="warsun_total">0</span>)</li>';
    html += '</ul>';
    html += '</p>';
    html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0 resources</span></div>';
    html += '<div id="confirm" class="buildchoice">click here to build</div>';
  
    this.updateStatus(html);
  
    let stuff_to_build = [];  
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");


      //
      // submit when done
      //
      if (id == "confirm") {
  
        let total_cost = 0;
        for (let i = 0; i < stuff_to_build.length; i++) {
  	  total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
        }
  
        if (imperium_self.game.players_info[imperium_self.game.player-1].production_bonus > 0) {
          total_cost -= imperium_self.game.players_info[imperium_self.game.player-1].production_bonus;
        }

        imperium_self.playerSelectResources(total_cost, function(success) {

  	  if (success == 1) {
            imperium_self.addMove("resolve\tplay");
            imperium_self.addMove("continue\t"+imperium_self.game.player+"\t"+sector);
            for (let y = 0; y < stuff_to_build.length; y++) {
  	      let planet_idx = imperium_self.returnPlayersLeastDefendedPlanetInSector(imperium_self.game.player, sector);
  	      //if (stuff_to_build[y] == "infantry") { planet_idx = 0; }
  	      imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\t"+stuff_to_build[y]+"\t"+sector);
	      imperium_self.tracker.production = 1;
            }
            imperium_self.endTurn();
            return;
  	  } else {
  	    alert("failure to find appropriate influence");
  	  }
        });

	return;  
      };
  


      //
      // build stuff
      //
      let calculated_total_cost = 0;
      for (let i = 0; i < stuff_to_build.length; i++) {
        calculated_total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
      }
      calculated_total_cost += imperium_self.returnUnitCost(id, imperium_self.game.player);
  
      //
      // reduce production costs if needed
      //
      if (imperium_self.game.players_info[imperium_self.game.player-1].production_bonus > 0) {
        calculated_total_cost -= imperium_self.game.players_info[imperium_self.game.player-1].production_bonus;
      }
  
      if (calculated_total_cost > imperium_self.returnAvailableResources(imperium_self.game.player)) {
        alert("You cannot build more than you have available to pay for it.");
        return;
      }

      //
      // respect production / cost limits
      //
      if (production_limit < stuff_to_build.length && production_limit > 0) {
        alert("You cannot build more units than your production limit");
        return;
      }
      if (cost_limit < calculated_total_cost && cost_limit > 0) {
        alert("You cannot build units that cost more than your cost limit");
        return;
      }
  
  
      //
      //  figure out if we need to load infantry / fighters
      //
      stuff_to_build.push(id);
  
      let total_cost = 0;
      for (let i = 0; i < stuff_to_build.length; i++) {
        total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
      }
  
      let divtotal = "." + id + "_total";
      let x = parseInt($(divtotal).html());
      x++;
      $(divtotal).html(x);
  
      //
      // reduce production costs if needed
      //
      if (imperium_self.game.players_info[imperium_self.game.player-1].production_bonus > 0) {
        total_cost -= imperium_self.game.players_info[imperium_self.game.player-1].production_bonus;
        imperium_self.updateLog("Production Costs reduced by 1");
      }
  
      let resourcetxt = " resources";
      if (total_cost == 1) { resourcetxt = " resource"; }
      $('.buildcost_total').html(total_cost + resourcetxt);
  
    });
  
  }
  
  


  playerTrade(mycallback) {
  
    let imperium_self = this;
    let factions = this.returnFactions();
  
    let html = '<p>Initiate Trade Offer with Faction: </p><ul>';
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.option').off();
    $('.option').on('click', function() {
  
      let faction = $(this).attr("id");
      let commodities_selected = 0;
      let goods_selected = 0;
  
      let html = "<p>Extend Trade Mission: </p><ul>";
      html += '<li id="commodities" class="option"><span class="commodities_total">0</span> commodities</li>';
      html += '<li id="goods" class="option"><span class="goods_total">0</span> goods</li>';
      html += '<li id="confirm" class="option">CLICK HERE TO SEND TRADE MISSION</li>';
      html += '</ul>';
  
      imperium_self.updateStatus(html);
  
      $('.option').off();
      $('.option').on('click', function() {
  
        let selected = $(this).attr("id");
  
        if (selected == "commodities") { commodities_selected++; }
        if (selected == "goods") { goods_selected++; }
        if (selected == "confirm") {
  	if (commodities_selected >= 1) {
  	  imperium_self.addMove("trade\t"+imperium_self.game.player+"\t"+(faction+1)+"commodities"+"\t"+commodities_selected);
  	}
  	if (goods_selected >= 1) {
  	  imperium_self.addMove("trade\t"+imperium_self.game.player+"\t"+(faction+1)+"goods"+"\t"+goods_selected);
  	}
        }
  
        if (commodities_selected > imperium_self.game.players_info[imperium_self.game.player-1].commodities) {
  	commodities_selected = imperium_self.game.players_info[imperium_self.game.player-1].commodities;
        }
        if (goods_selected > imperium_self.game.players_info[imperium_self.game.player-1].goods) {
  	goods_selected = imperium_self.game.players_info[imperium_self.game.player-1].goods;
        }
  
        $('.commodities_total').html(commodities_selected);
        $('.goods_total').html(goods_selected);
  
      });
    });
  }
  
  
  
  
  playerSelectSector(mycallback, mode=0) { 
  
    //
    // mode
    //
    // 0 = any sector
    // 1 = activated actor
    //
  
    let imperium_self = this;
  
    $('.sector').on('click', function() {
      let pid = $(this).attr("id");
      mycallback(pid);
    });
  
  }
  
  
  

  playerSelectPlanet(mycallback, mode=0) { 
  
    //
    // mode
    //
    // 0 = in any sector
    // 1 = in unactivated actor
    // 2 = controlled by me
    //
  
    let imperium_self = this;
  
    let html  = "Select a system in which to select a planet: ";
    this.updateStatus(html);
  
    $('.sector').on('click', function() {
  
      let sector = $(this).attr("id");
      let sys = imperium_self.returnSectorAndPlanets(sector);

      //
      // exit if no planets are controlled
      //
      if (mode == 2) {
	let exist_controlled_planets = 0;
        for (let i = 0; i < sys.p.length; i++) {
	  if (sys.p[i].owner == imperium_self.game.player) {
	    exist_controlled_planets = 1;
	  }
        }
	if (exist_controlled_planets == 0) {
	  alert("Invalid Choice: you do not control planets in that sector");
	  return;
	}
      }

  
      html = '<p>Select a planet in this system: </p><ul>';
      for (let i = 0; i < sys.p.length; i++) {
	if (mode == 0) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>';
	}
	if (mode == 1) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>';
	}
	if (mode == 2 && sys.p[i].owner == imperium_self.game.player) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + '</li>';
	}
      }
      html += '</ul>';
  

      imperium_self.updateStatus(html);
  
      $('.option').off();
      $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showPlanetCard(sector, s); });
      $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hidePlanetCard(sector, s); });
      $('.option').on('click', function() {
	let pid = $(this).attr("id");
	imperium_self.hidePlanetCard(sector, pid);
        mycallback(sector, pid);
      });
  
    });
  
  }
  
  
  
  playerSelectInfluence(cost, mycallback) {
  
    if (cost == 0) { mycallback(1); }
  
    let imperium_self = this;
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
    let array_of_cards_to_exhaust = [];
    let selected_cost = 0;
  
    let html  = "<p>Select "+cost+" in influence: </p><ul>";
    for (let z = 0; z < array_of_cards.length; z++) {
      html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
    }
    html += '</ul>';

//    html += '<ul>';
//    html += '<li class="textchoice" id="goods">trade goods</li>';
//    html += '</ul>';
  
    this.updateStatus(html);
    $('.cardchoice').on('click', function() {
  
      let action2 = $(this).attr("id");
      let tmpx = action2.split("_");
      
      let divid = "#"+action2;
      let y = tmpx[1];
      let idx = 0;
      for (let i = 0; i < array_of_cards.length; i++) {
        if (array_of_cards[i] === y) {
          idx = i;
        } 
      }
  
      imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);
  
      array_of_cards_to_exhaust.push(array_of_cards[idx]);
  
      $(divid).off();
      $(divid).css('opacity','0.3');
  
      selected_cost += imperium_self.game.planets[array_of_cards[idx]].resources;
  
      if (cost <= selected_cost) { mycallback(1); }
  
    });
  
  }
  





  playerSelectStrategyAndCommandTokens(cost, mycallback) {
 
    if (cost == 0) { mycallback(1); }
 
    let imperium_self = this;
    let selected_cost = 0;
 
    let html  = "<p>Select "+cost+" in Strategy and Command Tokens: </p><ul>";
    html += '<li class="textchoice" id="strategy">strategy tokens</li>';
    html += '<li class="textchoice" id="command">command tokens</li>';
    html += '</ul>';
 
    this.updateStatus(html);
    $('.cardchoice').on('click', function() {
 
      let action2 = $(this).attr("id");

      selected_cost++;
  
      if (action2 == "strategy") {
        imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
      }
      if (action2 == "command") {
        imperium_self.addMove("expend\t"+imperium_self.game.player+"\tcommand\t1");
      }

      if (cost <= selected_cost) { mycallback(1); }

    });

  }



  playerSelectResources(cost, mycallback) {
 
    if (cost == 0) { mycallback(1); }
 
    let imperium_self = this;
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
    let array_of_cards_to_exhaust = [];
    let selected_cost = 0;
 
    let html  = "<p>Select "+cost+" in resources: </p><ul>";
    for (let z = 0; z < array_of_cards.length; z++) {
      html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
    }
    html += '</ul>';
 
    this.updateStatus(html);
    $('.cardchoice').on('click', function() {
 
      let action2 = $(this).attr("id");
      let tmpx = action2.split("_");
  
      let divid = "#"+action2;
      let y = tmpx[1];
      let idx = 0;
      for (let i = 0; i < array_of_cards.length; i++) {
        if (array_of_cards[i] === y) {
          idx = i;
        }
      }


      imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);

      array_of_cards_to_exhaust.push(array_of_cards[idx]);

      $(divid).off();
      $(divid).css('opacity','0.3');

      selected_cost += imperium_self.game.planets[array_of_cards[idx]].resources;

      if (cost <= selected_cost) { mycallback(1); }

    });

  }







  
  playerSelectActionCard(mycallback, cancel_callback, types=[]) {  

    let imperium_self = this;
    let array_of_cards = this.returnPlayerActionCards(this.game.player, types);
    let action_cards = this.returnActionCards(types);

    let html = '';

    html += "<p>Select an action card: </p><ul>";
    for (let z in array_of_cards) {
      if (!this.game.players_info[this.game.player-1].action_cards_played.includes(this.game.deck[1].hand[z])) {
        let thiscard = action_cards[this.game.deck[1].hand[z]];
        html += '<li class="textchoice pointer" id="'+this.game.deck[1].hand[z]+'">' + thiscard.name + '</li>';
      }
    }
    html += '<li class="textchoice pointer" id="cancel">cancel</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showActionCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideActionCard(s); } });
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 != "cancel") { imperium_self.hideActionCard(action2); }
      if (action2 === "cancel") { cancel_callback(); return; }

      imperium_self.game.players_info[imperium_self.game.player-1].action_cards_played.push(action2);

      mycallback(action2);

    });
  
  }
  
  
  //
  // this is when players are choosing to play the cards that they have 
  // already chosen.
  //
  playerSelectStrategyCard(mycallback, mode=0) {

    let array_of_cards = this.game.players_info[this.game.player-1].strategy;
    let strategy_cards = this.returnStrategyCards();
    let imperium_self = this;  

    let html = "";

    html += "<p>Select a strategy card: </p><ul>";
    for (let z in array_of_cards) {
      if (!this.game.players_info[this.game.player-1].strategy_cards_played.includes(array_of_cards[z])) {
        html += '<li class="textchoice" id="'+array_of_cards[z]+'">' + strategy_cards[array_of_cards[z]].name + '</li>';
      }
    }
    html += '<li class="textchoice pointer" id="cancel">cancel</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 != "cancel") { imperium_self.hideStrategyCard(action2); }

      if (action2 === "cancel") {
	imperium_self.playerTurn();
	return;
      }

      mycallback(action2);

    });
  }
  


  
  //
  // this is when players select at the begining of the round, not when they 
  // are chosing to play the cards that they have already selected
  //
  playerSelectStrategyCards(mycallback) {

    let imperium_self = this;
    let cards = this.returnStrategyCards();
    let playercol = "player_color_"+this.game.player;
          
    let html  = "<div class='terminal_header'><div class='player_color_box "+playercol+"'></div>" + this.returnFaction(this.game.player) + ": select your strategy card:</div><ul>";
    if (this.game.state.round > 1) {
      html  = "<div class='terminal_header'>"+this.returnFaction(this.game.player) + ": select your strategy card:</div><ul>";
    }
    let scards = [];

    for (let z in this.strategy_cards) {
      scards.push("");
    }

    for (let z = 0; z < this.game.state.strategy_cards.length; z++) {
      let rank = parseInt(this.strategy_cards[this.game.state.strategy_cards[z]].rank);
      while (scards[rank-1] != "") { rank++; }
      scards[rank-1] = '<li class="textchoice" id="'+this.game.state.strategy_cards[z]+'">' + cards[this.game.state.strategy_cards[z]].name + '</li>';
    }

    for (let z = 0; z < scards.length; z++) {
      if (scards[z] != "") {
        html += scards[z];
      }
    }
    
    html += '</ul></p>';
  
    this.updateStatus(html);
    $('.textchoice').off();
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
    $('.textchoice').on('click', function() {
      let action2 = $(this).attr("id");
      imperium_self.hideStrategyCard(action2);
      mycallback(action2);
    });
  
  }
  
  

  playerRemoveInfantryFromPlanets(player, total=1, mycallback) {

    let imperium_self = this;

    let html =  '';
        html += '<p>Remove '+total+' infantry from planets you control:</p>';
	html += '<ul>'; 

    let infantry_to_remove = [];

    for (let s in this.game.planets) {
      let planet = this.game.planets[s];
      if (planet.owner == player) {
        let infantry_available_here = 0;
	for (let ss = 0; ss < planet.units[player-1].length; ss++) {
	  if (planet.units[player-1][ss].type == "infantry") { infantry_available_here++; }
	}
	if (infantry_available_here > 0) {
	  html += '<li class="option textchoice" id="'+s+'">' + planet.name + ' (<div style="display:inline" id="'+s+'_infantry">'+infantry_available_here+'</div>)</li>';
	}
      }
    }
    html += '<li class="option textchoice" id="end"></li>';
    html += '</ul>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 == "end") {

	for (let i = 0; i < infantry_to_remove.length; i++) {

	  let planet_in_question = imperium_self.game.planets[infantry_to_remove[i].planet];
	  
	  let total_units_on_planet = planet_in_question.units[player-1].length;
	  for (let ii = 0; ii < total_units_on_planet; ii++) {
	    let thisunit = planet_in_question.units[player-1][ii];
	    if (thisunit.type == "infantry") {
	      planet_in_question.units[player-1].splice(ii, 1);
	      ii = total_units_on_planet+2; // 0 as player_moves below because we have removed above
	      imperium_self.addMove("remove_infantry_from_planet\t"+player+"\t"+infantry_to_remove[i].planet+"\t"+"0");
	      imperium_self.addMove("notify\tREMOVING INFANTRY FROM PLANET: " + infantry_to_remove[i].planet);
console.log("PLANET HAS LEFT: " + JSON.stringify(planet_in_question));
	    }
	  }
	}
	mycallback(infantry_to_remove.length);
	return;
      }

      infantry_to_remove.push({ infantry : 1, planet : action2 });
      let divname = "#" + action2 + "_infantry";
      let existing_infantry = $(divname).html();
      let updated_infantry = parseInt(existing_infantry)-1;
      if (updated_infantry < 0) { updated_infantry = 0; }

      $(divname).html(updated_infantry);

      if (updated_infantry == 0) {
	$(this).remove();
      }

      if (infantry_to_remove.length >= total) {
	$('#end').click();
      }

    });

  }

  playerAddInfantryToPlanets(player, total=1, mycallback) {

    let imperium_self = this;

    let html =  '';
        html += '<p>Add '+total+' infantry to planets you control:</p>';
	html += '<ul>'; 

    let infantry_to_add = [];

    for (let s in this.game.planets) {
      let planet = this.game.planets[s];
      if (planet.owner == player) {
        let infantry_available_here = 0;
	for (let ss = 0; ss < planet.units[player-1].length; ss++) {
	  if (planet.units[player-1][ss].type == "infantry") { infantry_available_here++; }
	}
	html += '<li class="option textchoice" id="'+s+'">' + planet.name + ' (<div style="display:inline" id="'+s+'_infantry">'+infantry_available_here+'</div>)</li>';
      }
    }
    html += '<li class="option textchoice" id="end"></li>';
    html += '</ul>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 == "end") {
	for (let i = 0; i < infantry_to_add.length; i++) {
	  imperium_self.addMove("add_infantry_to_planet\t"+player+"\t"+infantry_to_add[i].planet+"\t"+"1");
	}
	mycallback(infantry_to_add.length);
	return;
      }

      infantry_to_add.push({ infantry : 1, planet : action2 });
      let divname = "#" + action2 + "_infantry";
      let existing_infantry = $(divname).html();
      let updated_infantry = parseInt(existing_infantry)+1;

      $(divname).html(updated_infantry);

      if (infantry_to_add.length >= total) {
	$('#end').click();
      }

    });

  }
  
  
  //////////////////////////
  // Select Units to Move //
  //////////////////////////
  playerSelectUnitsToMove(destination) {
  
    let imperium_self = this;
    let html = '';
    let hops = 3;
    let sectors = [];
    let distance = [];
    let fighters_loaded = 0; 
    let infantry_loaded = 0;
 
    let obj = {};
        obj.max_hops = 2;
        obj.ship_move_bonus = this.game.players_info[this.game.player-1].ship_move_bonus;
        obj.fleet_move_bonus = this.game.players_info[this.game.player-1].fleet_move_bonus;
        obj.ships_and_sectors = [];
        obj.stuff_to_move = [];  
        obj.stuff_to_load = [];  
        obj.distance_adjustment = 0;
  
        obj.max_hops += obj.ship_move_bonus;
        obj.max_hops += obj.fleet_move_bonus;
  
    let x = imperium_self.returnSectorsWithinHopDistance(destination, obj.max_hops);
    sectors = x.sectors; 
    distance = x.distance;
  
    for (let i = 0; i < distance.length; i++) {
      if (obj.ship_move_bonus > 0) {
        distance[i]--;
      }
      if (obj.fleet_move_bonus > 0) {
        distance[i]--;
      }
    }
  
    if (obj.ship_move_bonus > 0) {
      obj.distance_adjustment += obj.ship_move_bonus;
    }
    if (obj.fleet_move_bonus > 0) {
      obj.distance_adjustment += obj.fleet_move_bonus;
    }
  
    obj.ships_and_sectors = imperium_self.returnShipsMovableToDestinationFromSectors(destination, sectors, distance);

    let updateInterface = function(imperium_self, obj, updateInterface) {

      let subjective_distance_adjustment = 0;
      if (obj.ship_move_bonus > 0) {
        subjective_distance_adjustment += obj.ship_move_bonus;
      }
      if (obj.fleet_move_bonus > 0) {
        subjective_distance_adjustment += obj.fleet_move_bonus;
      }
      let spent_distance_boost = (obj.distance_adjustment - subjective_distance_adjustment);
 
      let playercol = "player_color_"+imperium_self.game.player;
      let html = "<div class='player_color_box "+playercol+"'></div> "+imperium_self.returnFaction(imperium_self.game.player)+': select ships to move<ul>';  

      //
      // select ships
      //
      for (let i = 0; i < obj.ships_and_sectors.length; i++) {
  
        let sys = imperium_self.returnSectorAndPlanets(obj.ships_and_sectors[i].sector);
        html += '<b class="sector_name" id="'+obj.ships_and_sectors[i].sector+'" style="margin-top:10px">'+sys.s.name+'</b>';
        html += '<ul>';
        for (let ii = 0; ii < obj.ships_and_sectors[i].ships.length; ii++) {
  
    	  //
    	  // figure out if we can still move this ship
  	  //
  	  let already_moved = 0;
  	  for (let z = 0; z < obj.stuff_to_move.length; z++) {
  	    if (obj.stuff_to_move[z].already_moved == 1) {
 	      already_moved = 1;
	    }
  	    if (obj.stuff_to_move[z].sector == obj.ships_and_sectors[i].sector) {
  	      if (obj.stuff_to_move[z].i == i) {
  	        if (obj.stuff_to_move[z].ii == ii) {
  	          already_moved = 1;
  	        }
  	      }
  	    }
  	  }	

  	  if (already_moved == 1) {
            html += '<li id="sector_'+i+'_'+ii+'" class=""><b>'+obj.ships_and_sectors[i].ships[ii].name+'</b></li>';
    	  } else {
  	    if (obj.ships_and_sectors[i].ships[ii].move - (obj.ships_and_sectors[i].adjusted_distance[ii] + spent_distance_boost) >= 0) {
              html += '<li id="sector_'+i+'_'+ii+'" class="option">'+obj.ships_and_sectors[i].ships[ii].name+'</li>';
  	    }
  	  }
        }

        html += '</ul>';
      }
      html += '</p>';
      html += '<div id="confirm" class="option">click here to move</div>';
      imperium_self.updateStatus(html);
 
      //
      // add hover / mouseover to sector names
      //
      let adddiv = ".sector_name";
      $(adddiv).on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.addSectorHighlight(s); });
      $(adddiv).on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.removeSectorHighlight(s); });



      $('.option').off();
      $('.option').on('click', function() {
  
        let id = $(this).attr("id");
  
        //
        // submit when done
        //
        if (id == "confirm") {
  
          imperium_self.addMove("resolve\tplay");
          imperium_self.addMove("space_invasion\t"+imperium_self.game.player+"\t"+destination);
          for (let y = 0; y < obj.stuff_to_move.length; y++) { 
            imperium_self.addMove("move\t"+imperium_self.game.player+"\t"+1+"\t"+obj.ships_and_sectors[obj.stuff_to_move[y].i].sector+"\t"+destination+"\t"+JSON.stringify(obj.ships_and_sectors[obj.stuff_to_move[y].i].ships[obj.stuff_to_move[y].ii])); 
          }
          for (let y = obj.stuff_to_load.length-1; y >= 0; y--) {
            imperium_self.addMove("load\t"+imperium_self.game.player+"\t"+0+"\t"+obj.stuff_to_load[y].sector+"\t"+obj.stuff_to_load[y].source+"\t"+obj.stuff_to_load[y].source_idx+"\t"+obj.stuff_to_load[y].unitjson+"\t"+obj.stuff_to_load[y].shipjson); 
          }
          imperium_self.endTurn();
          return;
        };
 

        //
        // highlight ship on menu
        //
        $(this).css("font-weight", "bold");
  
        //
        //  figure out if we need to load infantry / fighters
        //
        let tmpx = id.split("_");
        let i  = tmpx[1]; 
        let ii = tmpx[2];
        let calcdist = obj.ships_and_sectors[i].distance;
        let sector = obj.ships_and_sectors[i].sector;
        let sys = imperium_self.returnSectorAndPlanets(sector);
        let ship = obj.ships_and_sectors[i].ships[ii];
        let total_ship_capacity = imperium_self.returnRemainingCapacity(ship);
        let x = { i : i , ii : ii , sector : sector };


        //
        // calculate actual distance
        //
        let real_distance = calcdist + obj.distance_adjustment;
        let free_distance = ship.move + obj.fleet_move_bonus;
  
        if (real_distance > free_distance) {
  	  //
  	  // 
  	  //
  	  obj.ship_move_bonus--;
        }
 

        //
        // if this is a fighter, remove it from the underlying
        // list of units we can move, so that it is not double-added
	//
	if (ship.type == "fighter") {
	  obj.ships_and_sectors[i].ships[ii].already_moved = 1;
	}



  
        obj.stuff_to_move.push(x);
        updateInterface(imperium_self, obj, updateInterface);
 

        //
        // is there stuff left to move?
        //
	let stuff_available_to_move = 0;
        for (let i = 0; i < sys.p.length; i++) {
          let planetary_units = sys.p[i].units[imperium_self.game.player-1];
          for (let k = 0; k < planetary_units.length; k++) {
            if (planetary_units[k].type == "infantry") {
              stuff_available_to_move++;
            }
          }
        }
        for (let i = 0; i < sys.s.units[imperium_self.game.player-1].length; i++) {
          if (sys.s.units[imperium_self.game.player-1][i].type == "fighter") {
    	    stuff_available_to_move++;
          }
        }


	//
	// remove already-moved fighters from stuff-available-to-move
	// 
        let fighters_available_to_move = 0;
        for (let iii = 0; iii < sys.s.units[imperium_self.game.player-1].length; iii++) {
          if (sys.s.units[imperium_self.game.player-1][iii].type == "fighter") {
            let fighter_already_moved = 0;
            for (let z = 0; z < obj.stuff_to_move.length; z++) {
              if (obj.stuff_to_move[z].sector == sector) {
                if (obj.stuff_to_move[z].ii == iii) {
                  fighter_already_moved = 1;
                }
              }
            }  
            if (fighter_already_moved == 1) {
              stuff_available_to_move--;
            }
          }
        }


        if (total_ship_capacity > 0 && stuff_available_to_move > 0) {
          let remove_what_capacity = 0;
          for (let z = 0; z < obj.stuff_to_load.length; z++) {
    	    let x = obj.stuff_to_load[z];
  	    if (x.i == i && x.ii == ii) {
  	      let thisunit = JSON.parse(obj.stuff_to_load[z].unitjson);
  	      remove_what_capacity += thisunit.capacity_required;
  	    }
          }

          let user_message = `<div id="menu-container">This ship has <span class="capacity_remaining">${total_ship_capacity}</span> capacity to carry fighters / infantry. Do you wish to add them? <ul>`;
  
          for (let i = 0; i < sys.p.length; i++) {
            let planetary_units = sys.p[i].units[imperium_self.game.player-1];
            let infantry_available_to_move = 0;
            for (let k = 0; k < planetary_units.length; k++) {
              if (planetary_units[k].type == "infantry") {
                infantry_available_to_move++;
              }
            }
            if (infantry_available_to_move > 0) {
              user_message += '<li class="addoption option textchoice" id="addinfantry_p_'+i+'">add infantry from '+sys.p[i].name+' (<span class="add_infantry_remaining_'+i+'">'+infantry_available_to_move+'</span>)</li>';
            }
          }
  
          let fighters_available_to_move = 0;
          for (let iii = 0; iii < sys.s.units[imperium_self.game.player-1].length; iii++) {
            if (sys.s.units[imperium_self.game.player-1][iii].type == "fighter") {
	      let fighter_already_moved = 0;
  	      for (let z = 0; z < obj.stuff_to_move.length; z++) {
 	        if (obj.stuff_to_move[z].sector == sector) {
  	          if (obj.stuff_to_move[z].ii == iii) {
  	            fighter_already_moved = 1;
  	          }
  	        }
  	      }	
	      if (fighter_already_moved == 0) {
    	        fighters_available_to_move++;
	      }
            }
          }
          user_message += '<li class="addoption option textchoice" id="addfighter_s_s">add fighter (<span class="add_fighters_remaining">'+fighters_available_to_move+'</span>)</li>';
          user_message += '<li class="addoption option textchoice" id="skip">finish</li>';
          user_message += '</ul></div>';
  

          //
          // choice
          //
          $('.hud-menu-overlay').html(user_message);
          $('.hud-menu-overlay').show();
          $('.status').hide();
          $('.addoption').off();

  
	  //
	  // add hover / mouseover to message
	  //
          for (let i = 0; i < sys.p.length; i++) {
	    adddiv = "#addinfantry_p_"+i;
	    $(adddiv).on('mouseenter', function() { imperium_self.addPlanetHighlight(sector, i); });
	    $(adddiv).on('mouseleave', function() { imperium_self.removePlanetHighlight(sector, i); });
	  }
	  adddiv = "#addfighter_s_s";
	  $(adddiv).on('mouseenter', function() { imperium_self.addSectorHighlight(sector); });
	  $(adddiv).on('mouseleave', function() { imperium_self.removeSectorHighlight(sector); });

  
          // leave action enabled on other panels
          $('.addoption').on('click', function() {
  
            let id = $(this).attr("id");
            let tmpx = id.split("_");
            let action2 = tmpx[0];
 
    	  if (total_ship_capacity > 0) {

            if (action2 === "addinfantry") {
  
              let planet_idx = tmpx[2];
    	      let irdiv = '.add_infantry_remaining_'+planet_idx;
              let ir = parseInt($(irdiv).html());
              let ic = parseInt($('.capacity_remaining').html());
  
  	      //
  	      // we have to load prematurely. so JSON will be accurate when we move the ship, so player_move is 0 for load
  	      //
  	      let unitjson = imperium_self.unloadUnitFromPlanet(imperium_self.game.player, sector, planet_idx, "infantry");
  	      let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);  


              imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);
  	  
  	      $(irdiv).html((ir-1));
  	      $('.capacity_remaining').html((ic-1));
  
  	      let loading = {};
  	          loading.sector = sector;
  	          loading.source = "planet";
  	          loading.source_idx = planet_idx;
  	          loading.unitjson = unitjson;
  	          loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
  	          loading.shipjson = shipjson_preload;
  	          loading.i = i;
  	          loading.ii = ii;
  
  	      total_ship_capacity--;
  
  	      obj.stuff_to_load.push(loading);
  
  	      if (ic === 1 && total_ship_capacity == 0) {
                  $('.status').show();
                  $('.hud-menu-overlay').hide();
  	      }
  
              }
  
  
              if (action2 === "addfighter") {

		if (fighters_available_to_move <= 0) { return; }  

                let ir = parseInt($('.add_fighters_remaining').html());
                let ic = parseInt($('.capacity_remaining').html());
    	        $('.add_fighters_remaining').html((ir-1));
		fighters_available_to_move--;
  	        $('.capacity_remaining').html((ic-1));

		//
		// remove this fighter ...
		//
		let secs_to_check = obj.ships_and_sectors.length;
		for (let sec = 0; sec < obj.ships_and_sectors.length; sec++) {
		  if (obj.ships_and_sectors[sec].sector === sector) {
		    let ships_to_check = obj.ships_and_sectors[sec].ships.length;
		    for (let f = 0; f < ships_to_check; f++) {
		      if (obj.ships_and_sectors[sec].ships[f].already_moved == 1) {} else {
		        if (obj.ships_and_sectors[sec].ships[f].type == "fighter") {

			  // remove fighter from status menu
			  let status_div = '#sector_'+sec+'_'+f;
			  $(status_div).remove();

			  // remove from arrays (as loaded)
			  // removed fri june 12
		          //obj.ships_and_sectors[sec].ships.splice(f, 1);
		          //obj.ships_and_sectors[sec].adjusted_distance.splice(f, 1);
		          obj.ships_and_sectors[sec].ships[f] = {};
		          obj.ships_and_sectors[sec].adjusted_distance[f] = 0;
			  f = ships_to_check+2;
			  sec = secs_to_check+2;

		        }
		      }
		    }
		  }
	        }

  	        let unitjson = imperium_self.removeSpaceUnit(imperium_self.game.player, sector, "fighter");
  	        let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);  

                imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);
  
  	        let loading = {};
    	        obj.stuff_to_load.push(loading);
  
  	        loading.sector = sector;
  	        loading.source = "ship";
  	        loading.source_idx = "";
  	        loading.unitjson = unitjson;
  	        loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
  	        loading.shipjson = shipjson_preload;
  	        loading.i = i;
  	        loading.ii = ii;
  
  	        total_ship_capacity--;
  
  	        if (ic == 1 && total_ship_capacity == 0) {
                  $('.status').show();
                  $('.hud-menu-overlay').hide();
                }
              }
   	    } // total ship capacity
  
            if (action2 === "skip") {
              $('.hud-menu-overlay').hide();
              $('.status').show();
            }
  
          });
        }
      });
    };
  
    updateInterface(imperium_self, obj, updateInterface);
  
    return;
  
  }
  
  
  
  playerInvadePlanet(player, sector) {
  
    let imperium_self = this;
    let sys = this.returnSectorAndPlanets(sector);
  
    let total_available_infantry = 0;
    let space_transport_available = 0;
    let space_transport_used = 0;
  
    let landing_forces = [];
    let planets_invaded = [];
  
    html = '<p>Which planet(s) do you invade: </p><ul>';
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner != player) {
        html += '<li class="option sector_name" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>'; 
      }
    }
    html += '<li class="option" id="confirm">launch invasion(s)</li>'; 
    html += '</ul>';
    this.updateStatus(html);
  
    let populated_planet_forces = 0;
    let populated_ship_forces = 0;
    let forces_on_planets = [];
    let forces_on_ships = [];
  
    $('.option').off();
    let adiv = ".sector_name";
    $(adiv).on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.addPlanetHighlight(sector, s); });
    $(adiv).on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.removePlanetHighlight(sector, s); });
    $('.option').on('click', function () {
  
      let planet_idx = $(this).attr('id');
  
      if (planet_idx == "confirm") {

	for (let i = 0; i < planets_invaded.length; i++) {
          imperium_self.prependMove("bombardment\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
          imperium_self.prependMove("bombardment_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("planetary_defense\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("planetary_defense_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_start\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_end\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
	}

    	imperium_self.prependMove("continue\t" + imperium_self.game.player + "\t" + sector);
        imperium_self.endTurn();
        return;
      }

      //
      // looks like we have selected a planet for invasion
      //
      if (!planets_invaded.includes(planet_idx)) {
        planets_invaded.push(planet_idx);
      }

      //
      // figure out available infantry and ships capacity
      //
      for (let i = 0; i < sys.s.units[player - 1].length; i++) {
        let unit = sys.s.units[player-1][i];
        for (let k = 0; k < unit.storage.length; k++) {
  	if (unit.storage[k].type == "infantry") {
            if (populated_ship_forces == 0) {
              total_available_infantry += 1;
  	  }
  	}
        }
        if (sys.s.units[player - 1][i].capacity > 0) {
          if (populated_ship_forces == 0) {
            space_transport_available += sys.s.units[player - 1][i].capacity;
          }
        }
      }
  
      html = 'Select Ground Forces for Invasion of '+sys.p[planet_idx].name+': <p><ul>';
  
      //
      // other planets in system
      //
      for (let i = 0; i < sys.p.length; i++) {
        forces_on_planets.push(0);
        if (space_transport_available > 0 && sys.p[i].units[player - 1].length > 0) {
          for (let j = 0; j < sys.p[i].units[player - 1].length; j++) {
            if (sys.p[i].units[player - 1][j].type == "infantry") {
              if (populated_planet_forces == 0) {
                forces_on_planets[i]++;;
  	      }
            }
          }
          html += '<li class="invadechoice textchoice option" id="invasion_planet_'+i+'">'+sys.p[i].name+' (<span class="planet_'+i+'_infantry">'+forces_on_planets[i]+'</span>)</li>';
        }
      }
      populated_planet_forces = 1;
  
  
  
      //
      // ships in system
      //
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
        let ship = sys.s.units[player-1][i];
        forces_on_ships.push(0);
        for (let j = 0; j < ship.storage.length; j++) {
  	  if (ship.storage[j].type === "infantry") {
            if (populated_ship_forces == 0) {
              forces_on_ships[i]++;
  	    }
  	  }
        }
        if (forces_on_ships[i] > 0) {
          html += '<li class="invadechoice textchoice" id="invasion_ship_'+i+'">'+ship.name+' (<span class="ship_'+i+'_infantry">'+forces_on_ships[i]+'</span>)</li>';
        }
      }
      populated_ship_forces = 1;
      html += '<li class="invadechoice textchoice" id="finished_0_0">finish selecting</li>';
      html += '</ul></p>';
  
  
      //
      // choice
      //
      $('.hud-menu-overlay').html(html);
      $('.status').hide();
      $('.hud-menu-overlay').show();
  
  
      $('.invadechoice').off();
      $('.invadechoice').on('click', function() {

        let id = $(this).attr("id");
        let tmpx = id.split("_");
  
        let action2 = tmpx[0];
        let source = tmpx[1];
        let source_idx = tmpx[2];
        let counter_div = "." + source + "_"+source_idx+"_infantry";
        let counter = parseInt($(counter_div).html());
  
        if (action2 == "invasion") {
  
          if (source == "planet") {
     	    if (space_transport_available <= 0) { alert("Invalid Choice! No space transport available!"); return; }
  	    forces_on_planets[source_idx]--;
          } else {
  	    forces_on_ships[source_idx]--;
          }
          if (counter == 0) { 
   	    alert("You cannot attack with forces you do not have available."); return;
          }
 
    	  let unitjson = JSON.stringify(imperium_self.returnUnit("infantry", imperium_self.game.player));
  
          let landing = {};
              landing.sector = sector;
              landing.source = source;
              landing.source_idx = source_idx;
              landing.planet_idx = planet_idx;
              landing.unitjson = unitjson;
 
          landing_forces.push(landing);
  
          let planet_counter = ".invadeplanet_"+planet_idx;
          let planet_forces = parseInt($(planet_counter).html());
  
          planet_forces++;
          $(planet_counter).html(planet_forces);
  
          counter--;
          $(counter_div).html(counter);
  
        }
  
        if (action2 === "finished") {
  
          for (let y = 0; y < landing_forces.length; y++) {
    	    imperium_self.addMove("land\t"+imperium_self.game.player+"\t"+1+"\t"+landing_forces[y].sector+"\t"+landing_forces[y].source+"\t"+landing_forces[y].source_idx+"\t"+landing_forces[y].planet_idx+"\t"+landing_forces[y].unitjson);
          };
	  landing_forces = [];  

          $('.status').show();
          $('.hud-menu-overlay').hide();
  
          return;
        }
      });
    });
  }
  
  

  playerActivateSystem() {
  
    let imperium_self = this;
    let html  = "Select a sector to activate: ";
    let activated_once = 0;
  
    imperium_self.updateStatus(html);
  
    $('.sector').off();
    $('.sector').on('click', function() {

      //
      // only allowed 1 at a time
      //
      if (activated_once == 1) { return; }

      let pid = $(this).attr("id");
  
      if (imperium_self.canPlayerActivateSystem(pid) == 0) {
  
        alert("You cannot activate that system: " + pid);
  
      } else {
  
        activated_once = 1;
        let sys = imperium_self.returnSectorAndPlanets(pid);
        let divpid = '#'+pid;
  
        $(divpid).find('.hex_activated').css('background-color', 'yellow');
        $(divpid).find('.hex_activated').css('opacity', '0.3');
  
        let c = confirm("Activate this system?");
        if (c) {
          sys.s.activated[imperium_self.game.player-1] = 1;
          imperium_self.addMove("activate_system_post\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("activate_system\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"command"+"\t"+1);
	  imperium_self.endTurn();
        }
      }
  
    });
  }
  
  
  //
  // if we have arrived here, we are ready to continue with our options post
  // systems activation, which are move / pds combat / space combat / bombardment
  // planetary invasion / ground combat
  //
  playerPostActivateSystem(sector) {
  
    let imperium_self = this;

    let html  = "<p>" + this.returnFaction(this.game.player) + ": </p><ul>";
        html += '<li class="option" id="move">move into sector</li>';
    if (this.canPlayerProduceInSector(this.game.player, sector)) {
        html += '<li class="option" id="produce">produce units</li>';
    }
        html += '<li class="option" id="finish">finish turn</li>';
        html += '</ul>';
  
    imperium_self.updateStatus(html);
  
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");
  
      if (action2 == "move") {
        imperium_self.playerSelectUnitsToMove(sector);
      }
      if (action2 == "produce") {
        imperium_self.playerProduceUnits(sector);
      }
      if (action2 == "finish") {
        imperium_self.addMove("resolve\tplay");
        imperium_self.endTurn();
      }
    });
  }
  
  
  
  
  
  
  playerAllocateNewTokens(player, tokens) {
  
    let imperium_self = this;
  
    if (this.game.player == player) {
  
      let obj = {};
          obj.current_command = this.game.players_info[player-1].command_tokens;
          obj.current_strategy = this.game.players_info[player-1].strategy_tokens;
          obj.new_command = 0;
          obj.new_strategy = 0;
          obj.new_tokens = tokens;
  
      let updateInterface = function(imperium_self, obj, updateInterface) {
  
        let html = '<p>You have '+obj.new_tokens+' to allocate. How do you want to allocate them? </p><ul>';
            html += '<li class="option" id="strategy">Strategy Token '+(obj.current_strategy+obj.new_strategy)+'</li>';
            html += '<li class="option" id="command">Command Token '+(obj.current_command+obj.new_command)+'</li>';
            html += '</ul>';
  
        imperium_self.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
  	let id = $(this).attr("id");

 
        if (id == "strategy") {
          obj.new_strategy++;
          obj.new_tokens--;
          }

        if (id == "command") {
          obj.new_command++;
          obj.new_tokens--;
          }

        if (obj.new_tokens == 0) {
            if (imperium_self.game.confirms_needed > 0) {
              imperium_self.addMove("resolve\ttokenallocation\t1\t"+imperium_self.app.wallet.returnPublicKey());
	    } else {
              imperium_self.addMove("resolve\ttokenallocation");
	    }
            imperium_self.addMove("purchase\t"+player+"\tstrategy\t"+obj.new_strategy);
            imperium_self.addMove("purchase\t"+player+"\tcommand\t"+obj.new_command);
          imperium_self.endTurn();
          } else {
          updateInterface(imperium_self, obj, updateInterface);
        }

        });

      };

      updateInterface(imperium_self, obj, updateInterface);

    }

    return 0;
  }





  playerSelectPlayerWithFilter(msg, filter_func, mycallback=null, cancel_func=null) {

    let imperium_self = this;

    let html  = msg;
        html += '<ul>';

    for (let i = 0; i < this.game.players_info.length; i++) {
      if (filter_func(this.game.players_info[i]) == 1) {
        html += '<li class="textchoice" id="'+(i+1)+'">'+this.returnFaction((i+1))+'</li>';
      }
    }
    if (cancel_func != null) {
      html += '<li class="textchoice" id="cancel">cancel</li>';
    }
    html += '</ul>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {
       
      let action = $(this).attr("id");
                
      if (action == "cancel") {
        cancel_func();
        return 0;
      }

      mycallback(action);

    });
  }



  playerSelectSectorWithFilter(msg, filter_func, mycallback=null, cancel_func=null) {

    let imperium_self = this;

    let html  = msg;
        html += '<ul>';

    for (let i in this.game.board) {
      if (filter_func(this.game.board[i].tile) == 1) {
        html += '<li class="textchoice" id="'+this.game.board[i].tile+'">'+this.game.sectors[this.game.board[i].tile].name+'</li>';
      }
    }
    if (cancel_func != null) {
      html += '<li class="textchoice" id="cancel">cancel</li>';
    }
    html += '</ul>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {
       
      let action = $(this).attr("id");
                
      if (action == "cancel") {
        cancel_func();
        return 0;
      }

      mycallback(action);

    });
  }


  playerSelectPlanetWithFilter(msg, filter_func, mycallback=null, cancel_func=null) {

    let imperium_self = this;

    let html  = msg;
        html += '<ul>';

    for (let i in this.game.planets) {
      if (filter_func(this.game.planets[i]) == 1) {
        html += '<li class="textchoice" id="'+i+'">'+this.game.planets[i].name+'</li>';
      }
    }
    if (cancel_func != null) {
      html += '<li class="textchoice" id="cancel">cancel</li>';
    }
    html += '</ul>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let action = $(this).attr("id");

      if (action == "cancel") {
        cancel_func();
        return 0;
      }

      mycallback(action);

    });
  }





  playerSelectUnitInSectorFilter(msg, sector, filter_func, mycallback=null, cancel_func=null) {

    let imperium_self = this;
    let sys = this.returnSectorAndPlanets(sector);

    let html  = msg;
        html += '<ul>';

    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let ii = 0; ii < sys.s.units[i].length; ii++) {
        if (filter_func(sys.s.units[i][ii]) == 1) {
          html += '<li class="textchoice" id="'+sector+'_'+i+'_'+i+'">' + this.returnFaction((i+1)) + " - " + sys.s.units[i][ii].name + '</li>';
        }
      }
    }
    if (cancel_func != null) {
      html += '<li class="textchoice" id="cancel">cancel</li>';
    }
    html += '</ul>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let action = $(this).attr("id");

      if (action == "cancel") {
        cancel_func();
        return 0;
      }

      let tmpar = action.split("_");

      let s       = tmpar[0];
      let p       = tmpar[1];
      let unitidx = tmpar[2];

      mycallback({ sector : s , player : p , unitidx : unitidx });

    });
  }



  playerDiscardActionCards(num) {

    let imperium_self = this;

    let html  = "You must discard <div style='display:inline' class='totalnum' id='totalnum'>"+num+"</div> action card"; if (num > 1) { html += 's'; }; html += ':';
        html += '<ul>';
    for (let i = 0; i < this.game.geck[1].hand.length; i++) {
      html += '<li class="textchoice" id="'+i+'">' + this.action_cards[this.game.deck[1].hand[i]].name+'</li>';
    }
    html += '</ul>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      num--; 

      $('.totalnum').html(num);
      $(this).remove();
      imperium_self.game.players_info[imperium_self.game.player-1].action_cards_played.push(action2);

      if (num == 0) {
	imperium_self.endTurn();
      }

    });

  }




