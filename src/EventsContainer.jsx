import React from 'react';
import moment from 'moment';

function randomColor() {
  return Math.floor(Math.random() * 360);
}
function hslColor(hue, sat, lum) {
  return `hsl(${ hue }, ${ sat }%, ${ lum }%)`;
}
function backgroundColor(hue) {
  return hslColor(hue, 50, 80);
}
function textColor(hue) {
  return hslColor(hue, 100, 30);
}

const startOfToday = moment().startOf('day');
const msPerHour = 60 * 60 * 1000;
const pxPerMs = 1 / msPerHour;
const xToUnix = x => (x / pxPerMs) + startOfToday;
const unixToX = unixTimestamp => (unixTimestamp - startOfToday) * pxPerMs; //Every hour is 10 pixels

class EventsContainer extends React.Component {
  state = {
    isDragging: false,
    start: 0,
    end: 0,
    dragY: 0,
  };

  componentWillMount = () => {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };
  componentWillUnmount = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
  onMouseMove = e => {
    console.log('dragging? ', this.state.isDragging);
    if(this.state.isDragging) {
      console.log('this.state: ', this.state.start, this.state.end);
      const end = Math.round(e.pageX / this.props.snappingX) * this.props.snappingX;
      this.setState({ end });
    }
  };
  onMouseUp = () => {
    if(this.state.isDragging) {
      const { start, end, color, title } = this.state;
      this.props.onDrop({ start, end, color, title });
      this.setState({
        isDragging: false,
        end: 0,
      });
    }
  };
  onMouseDown = e => this.setState({
    isDragging: true,
    start: Math.round(e.pageX / this.props.snappingX) * this.props.snappingX,
    end: Math.round(e.pageX / this.props.snappingX) * this.props.snappingX,
    dragY: Math.round(e.pageY / this.props.snappingY) * this.props.snappingY,
    color: randomColor(),
    title: moment(xToUnix(Math.round(e.pageX / this.props.snappingX) * this.props.snappingX)).format('MMM Do'),
  });

  render() {
    const { start, end, color, title, isDragging, dragY } = this.state;
    const y = dragY - 100 - 90;

    //TODO: transform should be passed down.
    return <g transform="translate(0, 100)">
      <rect fill="rgba(0,0,0,0)" width={ 10000 } height={ 10000 } onMouseDown={ this.onMouseDown } />
      { isDragging && <rect { ...{ x: start, y, width: end - start, height: 50, fill: backgroundColor(color) } } /> }
      { isDragging &&
          <text { ...{
            x: start + (end - start) / 2,
            fontSize: 50 - 10 * 2,
            y: y + 50 / 2,
            fill: textColor(color),
          } }>{ title }</text>
      }
      { this.props.children }
    </g>
  }
}

export default EventsContainer;
