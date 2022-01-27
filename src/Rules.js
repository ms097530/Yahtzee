/** Rule for Yahtzee scoring.
 *
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 *
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 */

class Rule
{
  constructor(params)
  {
    // put all properties in params on instance
    Object.assign(this, params);
  }

  sum(dice)
  {
    // sum of all dice
    return dice.reduce((prev, curr) => prev + curr);
  }

  freq(dice)
  {
    // frequencies of dice values
    const freqs = new Map();
    // maps dice values to their frequency in key-value pair
    for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
    // array of results, i.e. in array of five different values [1,1,1,1,1] or for a full house [2,3]
    return Array.from(freqs.values());
  }

  count(dice, val)
  {
    // # times val appears in dice
    return dice.filter(d => d === val).length;
  }
}

/** Given a sought-for val, return sum of dice of that val.
 *
 * Used for rules like "sum of all ones"
 */

class TotalOneNumber extends Rule
{
  evalRoll = dice =>
  {
    return this.val * this.count(dice, this.val);
  };
  description = `Score ${this.val} for every ${this.val}`;
}

/** Given a required # of same dice, return sum of all dice.
 *
 * Used for rules like "sum of all dice when there is a 3-of-kind"
 */

class SumDistro extends Rule
{
  evalRoll = dice =>
  {
    // do any of the counts meet of exceed this distro?
    return this.freq(dice).some(c => c >= this.count) ? this.sum(dice) : 0;
  };
  description = `If ${this.count}+ of one value, score sum of all dice (else 0)`;
}

/** Check if full house (3-of-kind and 2-of-kind) */

class FullHouse extends Rule
{
  evalRoll = dice =>
  {
    // let diceSorted = dice.sort();
    // let countOne = dice.filter(die => die === diceSorted[0]).length;
    // let countTwo = dice.filter(die => die === diceSorted[dice.length - 1]).length;
    // return countOne === 3 && countTwo === 2 ? this.score : countOne === 2 && countTwo === 3 ? this.score : 0;
    const repeatValCounts = this.freq(dice);
    return repeatValCounts.includes(2) && repeatValCounts.includes(3) ? this.score : 0;
  }
  description = "If 3 of a kind and 2 of another kind, score 25 pts (else 0)";

}

/** Check for small straights. */

class SmallStraight extends Rule
{
  evalRoll = dice =>
  {
    const d = new Set(dice);
    let min = 7, max = 0;
    d.forEach((val) =>
    {
      min = val < min ? val : min;
      max = val > max ? val : max;
    })

    // small straight must be 4 different dice in a row or a large straight
    return d.size === 5 && (max - min === 4 || max - min === 5)
      ? this.score
      : d.size === 4 && max - min === 3 ? this.score : 0;
  }
  description = "If 4+ values in a row, score 30 pts (else 0)";
}

/** Check for large straights. */

class LargeStraight extends Rule
{
  evalRoll = dice =>
  {
    const d = new Set(dice);

    // large straight must be 5 different dice & only one can be a 1 or a 6
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  };
  description = "If 5 values in a row, score 40 pts (else 0)";
}

/** Check if all dice are same. */

class Yahtzee extends Rule
{
  evalRoll = dice =>
  {
    // all dice must be the same
    return this.freq(dice)[0] === 5 ? this.score : 0;
  };
  description = "If all values match, score 50 pts (else 0)";
}

// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1 });
const twos = new TotalOneNumber({ val: 2 });
const threes = new TotalOneNumber({ val: 3 });
const fours = new TotalOneNumber({ val: 4 });
const fives = new TotalOneNumber({ val: 5 });
const sixes = new TotalOneNumber({ val: 6 });

// three/four of kind score as sum of all dice
const threeOfKind = new SumDistro({ count: 3 });
const fourOfKind = new SumDistro({ count: 4 });

// full house scores as flat 25
const fullHouse = new FullHouse({ score: 25 });

// small/large straights score as 30/40
const smallStraight = new SmallStraight({ score: 30 });
const largeStraight = new LargeStraight({ score: 40 });

// yahtzee scores as 50
const yahtzee = new Yahtzee({ score: 50 });

// for chance, can view as some of all dice, requiring at least 0 of a kind
const chance = new SumDistro({ count: 0 });
chance.description = "Score sum of all dice";

export
{
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance
};
