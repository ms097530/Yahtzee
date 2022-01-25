import React, { Component } from "react";
import "./Die.css";

class Die extends Component
{
  constructor(props)
  {
    super(props);
    this.determineFace = this.determineFace.bind(this);
  }
  determineFace()
  {
    switch (this.props.val)
    {
      case 1: return 'one';
      case 2: return 'two';
      case 3: return 'three';
      case 4: return 'four';
      case 5: return 'five';
      case 6: return 'six';
    }
  }
  render()
  {
    return (
      <i
        className={`Die fas fa-dice-${this.determineFace()} ${this.props.locked ? `Die-locked` : ``} ${this.props.isRolling ? `Die-rolling` : ``}`}
        onClick={this.props.handleClick}
      >

      </i>
    );
  }
}

export default Die;
