import React from 'react';

class DraggableRect extends React.Component {
  state = {
    dragState: false,

    dragStart: 0,
    deltaStart: 0,
    deltaEnd: 0,
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
    if(this.state.dragState) {
      const deltaX = e.pageX - this.state.dragStart;
      switch(this.state.dragState) {
        case 'move': this.setState({ deltaStart: deltaX, deltaEnd: deltaX }); break;
        case 'expandEnd': this.setState({ deltaEnd: deltaX }); break;
        case 'expandStart': this.setState({ deltaStart: deltaX }); break;
        default: throw Error('wrong dragState: ', this.state.dragState);
      }
    }
  };
  onMouseUp = e => {
    if(this.state.dragState) {
      this.props.onDrop && this.props.onDrop({
        start: this.props.start + this.state.deltaStart,
        end: this.props.end + this.state.deltaEnd,
      });
      this.setState({ deltaStart: 0, deltaEnd: 0, dragState: false });
    }
  }

  render() {
    const { start, end, onDrop, ...props } = this.props;
    const { deltaStart, deltaEnd } = this.state;

    const x = start + deltaStart;
    const width = end + deltaEnd - x;
    const onMouseDown = dragState => e => this.setState({ dragStart: e.pageX, dragState });

    const resizeWidth = 10;

    return <g>
      <rect { ...{ x, width: resizeWidth, onMouseDown: onMouseDown('expandStart'), ...props } } />
      <rect { ...{
        x: x + resizeWidth,
        width: width - resizeWidth * 2,
        onMouseDown: onMouseDown('move'),
        ...props
      } } />
      <rect { ...{
        x: x + width - resizeWidth,
        width: resizeWidth,
        onMouseDown: onMouseDown('expandEnd'),
        ...props
      } } />
    </g>
  }
}

export default DraggableRect;
