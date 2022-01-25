import React, { Component } from "react";
import Dice from "./Dice";
import ScoreTable from "./ScoreTable";
import "./Game.css";

const NUM_DICE = 5;
const NUM_ROLLS = 3;
const MAX_TURNS = 13;

class Game extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      dice: Array.from({ length: NUM_DICE }).map(val => Math.ceil(Math.random() * 6)),
      // array that tracks which dice are and aren't locked between rolls
      locked: Array(NUM_DICE).fill(false),
      // counter for rolls left in a given round
      rollsLeft: NUM_ROLLS - 1,
      scores:
      {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined
      },
      isRolling: false,
      diceToRoll: Array(NUM_DICE).fill(true),
      turnsLeft: MAX_TURNS
    };

    this.roll = this.roll.bind(this);
    this.doScore = this.doScore.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.restart = this.restart.bind(this);
  }

  roll(evt)
  {
    // roll dice whose indexes are in reroll
    this.setState(st =>
    ({
      dice: st.dice.map((d, i) =>
        // check if this die is locked, if it is, use the same value, otherwise return random number 1-6
        st.locked[i] ? d : Math.ceil(Math.random() * 6)
      ),
      // check if player is allowed to roll again - if more rolls allowed, keep the current locked values, otherwise lock them all so player forced to assign score
      locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
      rollsLeft: st.rollsLeft - 1,
      isRolling: true,
    }), () => setTimeout(() => this.setState({ isRolling: false }), 1000));
  }

  toggleLocked(idx)
  {
    // toggle whether idx is in locked or not
    if (this.state.rollsLeft >= 1)
    {
      this.setState(st => ({
        locked:
          [
            ...st.locked.slice(0, idx),
            !st.locked[idx],
            ...st.locked.slice(idx + 1)
          ],
        diceToRoll:
          [
            ...st.diceToRoll.slice(0, idx),
            !st.diceToRoll[idx],
            ...st.diceToRoll.slice(idx + 1)
          ]
      }))
    };
  }

  doScore(rulename, ruleFn)
  {
    // evaluate this ruleFn with the dice and score this rulename
    if (this.state.scores[rulename] === undefined)  // prevents onClick event from being fired when clicking on an already used score type
    {
      this.setState(st => ({
        scores: { ...st.scores, [rulename]: ruleFn(this.state.dice) },
        rollsLeft: NUM_ROLLS,
        locked: st.turnsLeft === 1 ? Array(NUM_DICE).fill(true) : Array(NUM_DICE).fill(false),
        diceToRoll: Array(NUM_DICE).fill(true),
        turnsLeft: st.turnsLeft - 1
      }));
      this.roll();
    }
  }

  restart(e)
  {
    this.setState({
      dice: Array.from({ length: NUM_DICE }).map(val => Math.ceil(Math.random() * 6)),
      // array that tracks which dice are and aren't locked between rolls
      locked: Array(NUM_DICE).fill(false),
      // counter for rolls left in a given round
      rollsLeft: NUM_ROLLS - 1,
      scores:
      {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined
      },
      isRolling: false,
      diceToRoll: Array(NUM_DICE).fill(true),
      turnsLeft: MAX_TURNS
    });
  }

  render()
  {
    let total = 0;
    for (let key in this.state.scores)
    {
      if (this.state.scores[key] !== undefined)
        total += this.state.scores[key];
    }
    return (
      <div className='Game'>
        <header className='Game-header'>
          <h1 className='App-title'>Yahtzee!</h1>

          <section className='Game-dice-section'>
            <Dice
              dice={this.state.dice}
              locked={this.state.locked}
              handleClick={this.toggleLocked}
              isRolling={this.state.isRolling}
              diceToRoll={this.state.diceToRoll}
            />
            <div className='Game-button-wrapper'>
              <button
                className='Game-reroll'
                disabled={this.state.locked.every(x => x) || this.state.isRolling}
                onClick={this.roll}
              >
                {this.state.rollsLeft} Reroll{this.state.rollsLeft !== 1 ? 's' : ''} Left
              </button>
            </div>
          </section>
        </header>
        <ScoreTable doScore={this.doScore} scores={this.state.scores} />
        <div className="Game-footer">
          <p>Total Score: {total}</p>
          <p>Turns Left: {this.state.turnsLeft}</p>
        </div>
        <button className="Game-restart" onClick={this.restart}>Restart</button>
      </div>
    );
  }
}

export default Game;
