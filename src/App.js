import React, { Component } from 'react';
import logo from './logo.svg';
import moment from 'moment';

import DraggableRect from './DraggableRect';

import './App.css';

let id = 0;
let events = [
    1: {
        id: id,
        title: 'First Sprint',
        start: moment().startOf('week').add(1, 'week').unix(),
        end: moment().startOf('week').add(3, 'week').unix(),
        color: 'green',
    },
    2: {
        id: id,
        title: 'Second Sprint',
        start: moment().startOf('week').add(3, 'week').unix(),
        end: moment().startOf('week').add(5, 'week').unix(),
        color: 'blue',
    },
];

const startOfToday = moment().startOf('day').unix();
const msPerHour = 1000 * 60 * 60;
const pxPerMs = 10 / msPerHour;

const unixToX = unixTimestamp => (unixTimestamp - startOfToday) * pxPerMs; //Every hour is 10 pixels
const xToUnix = x => (x / pxPerMs) + startOfToday;

function translateEvent(e) {
  let obj = {};
  if(e.start) obj.start = xToUnix(e.start);
  if(e.end) obj.end = xToUnix(e.end);
}

class App extends Component {
  state = events;

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Simplest Gantt</h1>
        </header>
        <p className="App-intro">
          { Object.values(this.state).map(event =>
            <DraggableRect
              key={ event.id }
              start={ unixToX(event.start) }
              end={ unixToX(event.end) }
              onDrop={ e => this.setState({ [id]: { ...event, ...translateEvent(e) } }) }
            >
            </DraggableRect>
          ) }
        </p>
      </div>
    );
  }
}

export default App;
