import React, { Component } from 'react';
import moment from 'moment';

import EventsContainer from './EventsContainer';
import DraggableRect from './DraggableRect';

import './App.css';

function randomColor() {
  return Math.floor(Math.random() * 360);
}
function hslColor(hue, sat, lum) {
  return `hsl(${ hue }, ${ sat }%, ${ lum }%)`;
}
function backgroundColor(colorArray) {
  return hslColor(colorArray, 50, 80);
}
function textColor(colorArray) {
  return hslColor(colorArray, 100, 30);
}

let id = 0;
let events = {
    [++id]: {
        id,
        title: 'First Sprint',
        start: moment().startOf('week').add(1, 'week'),
        end: moment().startOf('week').add(3, 'week'),
        color: randomColor(),
    },
    [++id]: {
        id,
        title: 'Second Sprint',
        start: moment().startOf('week').add(3, 'week'),
        end: moment().startOf('week').add(5, 'week'),
        color: randomColor(),
    },
};

const startOfToday = moment().startOf('day');
const msPerHour = 60 * 60 * 1000;

//This dictates the scale
const pxPerMs = 1 / msPerHour;

const unixToX = unixTimestamp => (unixTimestamp - startOfToday) * pxPerMs; //Every hour is 10 pixels
const xToUnix = x => (x / pxPerMs) + startOfToday;

function translateEvent(e) {
  let obj = { ...e };
  if(e.start) obj.start = xToUnix(e.start);
  if(e.end) obj.end = xToUnix(e.end);
  return obj;
}

const barHeight = 50;
const barMargin = 10;
const barPadding = 10;

class App extends Component {
  state = events;

  dateNotches = () => {
    let dateGroups = [];

    const earliestStart = Object.values(this.state).reduce((earliest, event) => event.start < earliest ? event.start : earliest, Math.MAX_SAFE_INTEGER);

    let momentIndex = moment(earliestStart).startOf('month').startOf('week');
    let xIndex;
    while((xIndex = unixToX(+momentIndex)) < window.innerWidth) {
      momentIndex.add(1, 'week');
      dateGroups.push(<g transform={ `translate(${ xIndex })` } key={ +momentIndex }>
        <text>{ momentIndex.format('MMM Do') }</text>
        <line y1={ 10 } y2={ 30 } />
      </g>);
    }

    return <g transform="translate(0, 80)">{ dateGroups }</g>
  }

  render() {
    const snappingX = +moment.duration(1, 'day') * pxPerMs;
    const snappingY = barHeight + barPadding;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Simplest Gantt</h1>
        </header>
        <svg>
          <line x1="0" x2="10000" y1="100" y2="100" />
          { this.dateNotches() }

          <EventsContainer { ...{ snappingX, snappingY, onDrop: event => this.setState({ [++id]: { id, ...translateEvent(event) } }) } }>
            { Object.values(this.state).sort((a, b) => a.start - b.start).map((event, i) =>
              <DraggableRect
                key={ event.id }
                start={ unixToX(event.start) }
                end={ unixToX(event.end) }
                onDrop={ e => this.setState({ [event.id]: { ...event, ...translateEvent(e) } }) }
                y={ barHeight + i * (barHeight + barMargin * 2) }
                height={ barHeight }
                fill={ backgroundColor(event.color) }
                snappingX={ this.snappingX }
              >
                <text { ...{
                  x: (unixToX(event.end) - unixToX(event.start)) / 2,
                  fontSize: barHeight - barPadding * 2,
                  y: barHeight / 2,
                  fill: textColor(event.color),
                } }>{ event.title }</text>
              </DraggableRect>
            ) }
          </EventsContainer>
        </svg>
      </div>
    );
  }
}

export default App;
