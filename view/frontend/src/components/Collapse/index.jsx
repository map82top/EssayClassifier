import React from 'react';

class Collapse extends React.Component {
    static defaultProps = {
        initialStyle: undefined,
        checkTimeout: 50,
        direction: 'vertical'
    };

  timeout = undefined;
  container = undefined;

  constructor(props) {
    super(props);
    this.dimension = props.direction === 'vertical' ? 'height' : 'width';
    let dimensionValue = props.isOpened ? 'auto' : '0px';
    let dimensionContainer = props.direction ==='vertical' ?  { height: dimensionValue } : { width: dimensionValue}

    this.initialStyle = props.isOpened
        ? {overflow: 'initial', ...dimensionContainer }
        : {overflow: 'hidden', ...dimensionContainer };
  }

  componentDidMount() {
    this.onResize();
  }

  shouldComponentUpdate(nextProps) {
    const {isOpened, children} = this.props;

    return children !== nextProps.children
      || isOpened !== nextProps.isOpened;
  }

  getSnapshotBeforeUpdate() {
    if (!this.container) {
      return null;
    }
    if (this.container.style[this.dimension] === 'auto') {
      let { maxDimensionSize } = this.getDimensionsSize();
      this.container.style[this.dimension] = `${maxDimensionSize}px`;
    }
    return null;
  }

  getDimensionsSize() {
    let maxDimensionSize = this.dimension === 'height' ? this.container.scrollHeight : this.container.scrollWidth;
    let currentDimensionSize = this.dimension === 'height' ? this.container.clientHeight : this.container.clientWidth;

    return { maxDimensionSize, currentDimensionSize };
  }


  componentDidUpdate() {
    this.onResize();
  }


  componentWillUnmount() {
    global.clearTimeout(this.timeout);
  }

  onResize = () => {
    global.clearTimeout(this.timeout);

    if (!this.container) {
      return;
    }

    const {isOpened, checkTimeout} = this.props;
    const { maxDimensionSize, currentDimensionSize } = this.getDimensionsSize();

    const isFullyOpened = isOpened && maxDimensionSize === currentDimensionSize;
    const isFullyClosed = !isOpened && currentDimensionSize === 0;

    if (isFullyOpened || isFullyClosed) {
      this.onRest({isOpened, maxDimensionSize});
    } else {
      this.onWork({isOpened, maxDimensionSize});
      this.timeout = setTimeout(() => this.onResize(), checkTimeout);
    }
  };


  onRest = ({isOpened, maxDimensionSize}) => {
    if (!this.container) {
      return;
    }

    const hasOpened = isOpened && this.container.style[this.dimension] === `${maxDimensionSize}px`;
    const hasClosed = !isOpened && this.container.style[this.dimension] === '0px';

    if (hasOpened || hasClosed) {
      this.container.style.overflow = isOpened ? 'initial' : 'hidden';
      this.container.style[this.dimension] = isOpened ? 'auto' : '0px';
    }
  };


  onWork = ({isOpened, maxDimensionSize}) => {
    if (!this.container) {
      return;
    }

    const isOpening = isOpened && this.container.style[this.dimension] === `${maxDimensionSize}px`;
    const isClosing = !isOpened && this.container.style[this.dimension] === '0px';

    if (isOpening || isClosing) {
      // No need to do any work
      return;
    }

    this.container.style.overflow = 'hidden';
    this.container.style[this.dimension] = isOpened ? `${maxDimensionSize}px` : '0px';
  };


  onRefContainer = container => {
    this.container = container;
  };

  render() {
    const {children, isOpened, className} = this.props;
    return (
      <div
          className={className}
          ref={this.onRefContainer}
          style={this.initialStyle}
          aria-hidden={!isOpened}
      >
          {children}
      </div>
    );
  }
}


export default Collapse;