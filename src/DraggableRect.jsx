import React from 'react';

class DraggableRect extends React.Component {
  render() {
    const { start: x, end, onDrop, ...props } = this.props;
    const width = end - x;
    return <rect { ...{ x, width, ...props } } />
  }
}

export default DraggableRect;
