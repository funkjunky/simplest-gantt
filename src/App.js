import React, { Component } from 'react';
import moment from 'moment';

import DraggableRect from './DraggableRect';

import './App.css';

let id = 0;
let events = {
    [++id]: {
        id,
        title: 'First Sprint',
        start: moment().startOf('week').add(1, 'week').unix(),
        end: moment().startOf('week').add(3, 'week').unix(),
        color: 'green',
    },
    [++id]: {
        id,
        title: 'Second Sprint',
        start: moment().startOf('week').add(3, 'week').unix(),
        end: moment().startOf('week').add(5, 'week').unix(),
        color: 'blue',
    },
};

const startOfToday = moment().startOf('day').unix();
const sPerHour = 60 * 60;

//This dictates the scale
const pxPerS = 1 / sPerHour;

const unixToX = unixTimestamp => (unixTimestamp - startOfToday) * pxPerS; //Every hour is 10 pixels
const xToUnix = x => (x / pxPerS) + startOfToday;

function translateEvent(e) {
  let obj = {};
  if(e.start) obj.start = xToUnix(e.start);
  if(e.end) obj.end = xToUnix(e.end);
}

const barHeight = 20;
const barMargin = 10;

class App extends Component {
  state = events;

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Simplest Gantt</h1>
        </header>
        <svg>
          { Object.values(this.state).map((event, i) =>
            <DraggableRect
              key={ event.id }
              start={ unixToX(event.start) }
              end={ unixToX(event.end) }
              onDrop={ e => this.setState({ [id]: { ...event, ...translateEvent(e) } }) }
              y={ barHeight + i * (barHeight + barMargin * 2) }
              height={ barHeight }
            >
            </DraggableRect>
          ) }
        </svg>
      </div>
    );
  }
}

export default App;
