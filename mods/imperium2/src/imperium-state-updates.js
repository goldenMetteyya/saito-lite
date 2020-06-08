  

  //
  // synchronousGameEvents
  //
  executeSynchronousGameEvent(eventname="", arg2=null, arg3=null, arg4=null, arg5=null, arg6=null, arg7=null, arg8=null) {

    let technologies = this.returnTechnologyTree();

    for (let i = 0; i < this.game.players_info.length; i++) {

      let techs = this.game.players_info[i].tech;
      for (let k = 0; k < techs.length; k++) {

        //
        // destroyed unit
        //
        if (eventname === "destroyed_unit") {
	  let attacker   = arg2;
	  let defender   = arg3;
	  let sector     = arg4;
	  let planet_idx = arg5;
	  let unitname   = arg6;

          if (technologies[techs[k]].destroyedUnitTriggersSync(this, (i+1), attacker, defender, sector, planet_idx, unitname) == 1) {
            technologies[techs[k]].destroyedUnitEventSync(this, (i+1), attacker, defender, sector, planet_idx, unitname);
          }
        }

      }
    }
  }




  //
  // this function can be run after a tech bonus is used, to see if 
  // it is really exhausted for the turn, or whether it is from an
  // underlying tech bonus (and will be reset so as to be always
  // available.
  //
  resetTechBonuses() {

    let technologies = this.returnTechnologyTree();

    //
    // reset tech bonuses
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let ii = 0; ii < this.game.players_info[i].tech.length; ii++) {
        technologies[this.game.players_info[i].tech[ii]].onNewTurn();
      }
    }
  }
 

  deactivateSystems() {

    //
    // deactivate all systems
    //
    for (var sys in this.game.systems) {
      for (let j = 0; j < this.totalPlayers; j++) {
        this.game.systems[sys].activated[j] = 0;
      }
    }

  }
 


  exhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 1;
  }
  unexhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 0;
  }
  updatePlanetOwner(sector, planet_idx) {
    let sys = this.returnSystemAndPlanets(sector);
    let owner = -1;
console.log("PLANET STATE: " + JSON.stringify(sys.p[planet_idx]));

    for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
      if (sys.p[planet_idx].units[i].length > 0) { owner = i+1; }
    }
    if (owner != -1) {
this.updateLog("setting owner to " + owner);
      sys.p[planet_idx].owner = owner;
      sys.p[planet_idx].exhausted = 1;
    }
    this.saveSystemAndPlanets(sys);
  }
  
  
  
  

  //
  //
  //
  pdsSpaceDefense(attacker, destination, hops=1) {

    let sys = this.returnSystemAndPlanets(destination);
    let x = this.returnSectorsWithinHopDistance(destination, hops);
    let sectors = [];
    let distance = [];
  
    sectors = x.sectors;
    distance = x.distance;

  
    //
    // get enemy pds units within range
    //
    let battery = this.returnPDSWithinRange(attacker, destination, sectors, distance);
    let hits = 0;
  
    if (battery.length > 0) {
  
      for (let i = 0; i < battery.length; i++) {
  
        let roll = this.rollDice();

	//
	// modify pdf rolls
	//
	roll += this.game.players_info[battery[i].owner-1].pds_combat_roll_modifier;

        if (roll >= battery[i].combat) {

          hits++;

          this.assignHitsToSpaceFleet(battery[i].owner, attacker, destination, 1);
          this.eliminateDestroyedUnitsInSector(attacker, destination);

        }
  
      }
  
      if (hits > 1) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hit");
      }
      if (hits == 1) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hits");
      }
      if (hits == 0) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hit");
      }
  
  
    }
  }
  
  
  

  
  


  spaceCombat(attacker, sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
  
    let defender = 0;
    let defender_found = 0;
    for (let i = 0; i < sys.s.units.length; i++) {
      if (attacker != (i+1)) {
        if (sys.s.units[i].length > 0) {
  	defender = (i+1);
  	defender_found = 1;
        }
      }
    }
  
    if (defender_found == 0) { return; }
  
    let attacker_faction = this.returnFaction(attacker);
    let defender_faction = this.returnFaction(defender);
  
    let attacker_forces = this.returnNumberOfSpaceFleetInSector(attacker, sector);
    let defender_forces = this.returnNumberOfSpaceFleetInSector(defender, sector);

    let total_attacker_hits = 0;
    let total_defender_hits = 0;
  
    //
    // attacker rolls first
    //
    let attacker_hits = 0;
    let defender_hits = 0;
  
    for (let z = 0; z < sys.s.units[attacker-1].length; z++) {
      let unit = sys.s.units[attacker-1][z];
      let roll = this.rollDice(10);

      //
      // apply modifiers
      //
      roll += this.game.players_info[attacker-1].space_combat_roll_modifier;


      if (roll >= unit.combat) {
        this.updateLog(attacker_faction + " " +unit.name + " hits (roll: "+roll+")");
        attacker_hits++;  
      } else {
        //this.updateLog(attacker_faction + " " +unit.name + " misses (roll: "+roll+")");
      }
    }
  
    for (let z = 0; z < sys.s.units[defender-1].length; z++) {
      let unit = sys.s.units[defender-1][z];
      let roll = this.rollDice(10);

      //
      // apply modifiers
      //
      roll += this.game.players_info[defender-1].space_combat_roll_modifier;


      if (roll >= unit.combat) {
        this.updateLog(defender_faction + " " +unit.name + " hits (roll: "+roll+")");
        defender_hits++;  
      } else {
        //this.updateLog(defender_faction + " " +unit.name + " misses (roll: "+roll+")");
      }
    }

    this.updateLog("Attacker hits: " + attacker_hits);
    this.updateLog("Defender hits: " + defender_hits);

    this.game.state.space_combat_ships_destroyed_attacker = this.assignHitsToSpaceFleet(defender, attacker, sector, defender_hits);
    this.game.state.space_combat_ships_destroyed_defender = this.assignHitsToSpaceFleet(attacker, defender, sector, attacker_hits);

    //
    // attacker strikes defender
    //
    attacker_forces = this.returnNumberOfSpaceFleetInSector(attacker, sector);
    defender_forces = this.returnNumberOfSpaceFleetInSector(defender, sector);
  
    total_attacker_hits += attacker_hits;
    total_defender_hits += defender_hits;
  
    if (total_attacker_hits > 0) {
      this.updateLog(total_attacker_hits + " hits for " + this.returnFaction(attacker));
    }
    if (total_defender_hits > 0) {
      this.updateLog(total_defender_hits + " hits for " + this.returnFaction(defender));
    }
  
    //
    // evaluate if sector has changed hands
    //
    if (attacker_forces > defender_forces && defender_forces == 0) {  

      //
      // notify everyone
      //
      this.updateLog(sys.s.name + " is now controlled by "+ this.returnFaction(attacker));
  
    }


    //
    // remove destroyed units
    //
    this.eliminateDestroyedUnitsInSector(attacker, sector);
    this.eliminateDestroyedUnitsInSector(defender, sector);
  
    //
    // save regardless
    //
    this.saveSystemAndPlanets(sys);
  
  }




  groundCombat(attacker, sector, planet_idx) {

try {
  
    let sys = this.returnSystemAndPlanets(sector);
  
    let defender = 0;
    let defender_found = 0;

    if (sys.p.length > planet_idx) {
      for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
        if (attacker != (i+1)) {
          if (sys.p[planet_idx].units[i].length > 0) {
  	    defender = (i+1);
    	    defender_found = 1;
          }
        }
      }
    }
    if (defender_found == 0) {
      this.updateLog("taking undefended planet");
      sys.p[planet_idx].owner = attacker;
      sys.p[planet_idx].exhausted = 1;
      return; 
    }

console.log("TESTING A 1");
  
    let attacker_faction = this.returnFaction(attacker);
    let defender_faction = this.returnFaction(defender);
  
    let attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
    let defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);
console.log("TESTING A 2");

    //
    // attacker rolls first
    //
    let attacker_hits = 0;
    let defender_hits = 0;
  
    for (let z = 0; z < sys.p[planet_idx].units[attacker-1].length; z++) {
      let unit = sys.p[planet_idx].units[attacker-1][z];
      if (unit.name == "infantry") {
        let roll = this.rollDice(10);

        //
        // apply modifiers
        //
        roll += this.game.players_info[attacker-1].ground_combat_roll_modifier;

        if (roll >= unit.combat) {
          attacker_hits++;  
        }
      }
    }
  
    for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
      let unit = sys.p[planet_idx].units[defender-1][z];
      if (unit.name == "infantry") {
        let roll = this.rollDice(10);

        //
        // apply modifiers
        //
        roll += this.game.players_info[defender-1].ground_combat_roll_modifier;

        if (roll >= unit.combat) {
          defender_hits++;  
        }
      }
    }
console.log("TESTING A 3: " + defender_hits + " / " + attacker_hits); 
 
    this.assignHitsToGroundForces(defender, attacker, sector, planet_idx, defender_hits);
    this.assignHitsToGroundForces(attacker, defender, sector, planet_idx, attacker_hits);


    this.eliminateDestroyedUnitsInSector(attacker, sector);
    this.eliminateDestroyedUnitsInSector(defender, sector);

console.log("TESTING A 4"); 

    if (attacker_hits > 0) {
      this.updateLog(attacker_hits + " hits for " + this.returnFaction(attacker));
    }
    if (defender_hits > 0) {
      this.updateLog(defender_hits + " hits for " + this.returnFaction(defender));
    }
console.log("TESTING A 5");  
 
    attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
    defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);


console.log("ATTACKER FORCES 2: " + attacker_forces);
console.log("DEFENDER FORCES 2: " + defender_forces);

    //
    // evaluate if planet has changed hands
    //
    if (attacker_forces > defender_forces && defender_forces <= 0) {
 
console.log(" . 1"); 
      //
      // destroy all units belonging to defender (pds, spacedocks)
      //
      if (defender != -1) {
        sys.p[planet_idx].units[defender-1] = [];
      }
  
console.log(" . 2"); 

      //
      // notify everyone
      //
      let survivors = 0;
      for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
        if (sys.p[planet_idx].units[attacker-1][i].name == "infantry") { survivors++; }
      }
console.log(" . 3"); 
      if (survivors == 1) { 
        this.updateLog(sys.p[planet_idx].name + " is conquered by " + this.returnFaction(attacker) + " (" + survivors + " survivor)");
      } else {
        this.updateLog(sys.p[planet_idx].name + " is conquered by " + this.returnFaction(attacker) + " (" + survivors + " survivors)");
      }
console.log(" . 4"); 
  
      //
      // planet changes ownership
      //
console.log("#########");
console.log("#########");
console.log("#########");
console.log("#########");
console.log("Updating owner to: " + attacker);
      //sys.p[planet_idx].owner = attacker;
this.updateLog("planet owner is set 2: " + attacker);
      //sys.p[planet_idx].exhausted = 1;
      this.updatePlanetOwner(sector, planet_idx);
console.log("PLANET UPDATED: " + JSON.stringify(sys.p[planet_idx]));
    }

console.log("skipping etc.");

    //
    // save regardless
    //
    this.saveSystemAndPlanets(sys);
} catch (err) {
console.log(JSON.stringify(err));
  process.exit(1);
}  
  }
  







  eliminateDestroyedUnitsInSector(player, sector) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSystemAndPlanets(sector);
  
    //
    // in space
    //
    for (let z = 0; z < sys.s.units[player-1].length; z++) {
      if (sys.s.units[player-1][z].destroyed == 1) {
        sys.s.units[player-1].splice(z, 1);
        z--;
      }
    }
  
    //
    // on planets
    //
    for (let planet_idx = 0; planet_idx < sys.p.length; planet_idx++) {
      for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
        if (sys.p[planet_idx].units[player-1][z].destroyed == 1) {
console.log("ELIMINATING DESTROYED UNIT FROM PLAYER ARRAY ON PLANET");
          sys.p[planet_idx].units[player-1].splice(z, 1);
          z--;
        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }
  




  eliminateDestroyedUnitsOnPlanet(player, sector, planet_idx) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSystemAndPlanets(sector);
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].destroyed == 1) {
        sys.p[planet_idx].units[player-1].splice(z, 1);
        z--;
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }




  assignHitsToGroundForces(attacker, defender, sector, planet_idx, hits) {

    let ground_forces_destroyed = 0;  
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < hits; i++) {
  
      //
      // find weakest unit
      //
      let weakest_unit = -1;
      let weakest_unit_idx = -1;
      for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
        let unit = sys.p[planet_idx].units[defender-1][z];

        if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	  weakest_unit = sys.p[planet_idx].units[defender-1].strength;
  	  weakest_unit_idx = z;
        }

        if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	  weakest_unit = unit.strength;
  	  weakest_unit_idx = z;
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx != -1) {
        sys.p[planet_idx].units[defender-1][weakest_unit_idx].strength--;
        if (sys.p[planet_idx].units[defender-1][weakest_unit_idx].strength <= 0) {
          ground_forces_destroyed++;
          sys.p[planet_idx].units[defender-1][weakest_unit_idx].destroyed = 1;

          // let attacker   = arg2;
          // let defender   = arg3;
          // let sector     = arg4;
          // let planet_idx = arg5;
          // let unitname   = arg6;

	  this.executeSynchronousGameEvent("destroyed_unit", attacker, defender, sector, planet_idx, sys.p[planet_idx].units[defender-1][weakest_unit_idx].name);

        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
    return ground_forces_destroyed;

  }




  assignHitsToSpaceFleet(attacker, defender, sector, hits) {

    let ships_destroyed = 0;  
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < hits; i++) {
  
      //
      // find weakest unit
      //
      let weakest_unit = -1;
      let weakest_unit_idx = -1;
      for (let z = 0; z < sys.s.units[defender-1].length; z++) {
        let unit = sys.s.units[defender-1][z];
        if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	  weakest_unit = sys.s.units[defender-1][z].strength;
  	  weakest_unit_idx = z;
        }
        if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	  weakest_unit = unit.strength;
  	  weakest_unit_idx = z;
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx != -1) {
        sys.s.units[defender-1][weakest_unit_idx].strength--;
        if (sys.s.units[defender-1][weakest_unit_idx].strength <= 0) {
	  ships_destroyed++;
          sys.s.units[defender-1][weakest_unit_idx].destroyed = 1;

          // let attacker   = arg2;
          // let defender   = arg3;
          // let sector     = arg4;
          // let planet_idx = arg5;
          // let unitname   = arg6;

	  this.executeSynchronousGameEvent("destroyed_unit", attacker, defender, sector, "", sys.s.units[defender-1][weakest_unit_idx].name);

        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
    return ships_destroyed;  

  }
  
  


