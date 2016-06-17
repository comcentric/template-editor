import React from 'react'
import classnames from 'classnames'
import './styles/transformable.scss'

const CORNERS = [
  {
    direction: `n`,
    className: `center top`
  },
  {
    direction: `s`,
    className: `center bottom`
  },
  {
    direction: `nw`,
    className: `left top`
  },
  {
    direction: `ne`,
    className: `right top`
  },
  {
    direction: `sw`,
    className: `left bottom`
  },
  {
    direction: `se`,
    className: `right bottom`
  },
  {
    direction: `w`,
    className: `left middle`
  },
  {
    direction: `e`,
    className: `right middle`
  }
]

export default class Trasformable extends React.Component {
  constructor(props) {
    super(props)
    this.handleStartMoving = this.handleStartMoving.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)

    this.handleResize = {
      n: this.handleNorth.bind(this),
      ne: this.handleNorthEast.bind(this),
      e: this.handleEast.bind(this),
      se: this.handleSouthEast.bind(this),
      s: this.handleSouth.bind(this),
      sw: this.handleSouthWest.bind(this),
      w:  this.handleWest.bind(this),
      nw:  this.handleNorthWest.bind(this)
    }

    this.state = {
      style: {
        top: 0,
        left: 0,
        width: 20,
        height: 20,
        ...this.props.defaultStyle
      }
    }
  }

  handleStartMoving(e) {
    if (!this.direction) {
      this.handleMouseDown(undefined, e.clientX, e.clientY)
    }
  }

  handleStartResizing(direction, e) {
    console.log(direction)
    this.handleMouseDown(direction, e.clientX, e.clientY)
  }

  handleMouseDown(direction, x, y) {
    this.direction = direction
    this.initialStyle = {
      ...this.state.style
    }

    this.initialPosition = {
      x: x,
      y: y
    }

    if (this.props.beforeResize) {
      this.props.beforeResize({
        currentStyle: this.initialStyle,
        position: this.initialPosition,
        direction: this.direction
      })
    }

    window.addEventListener(`mousemove`, this.handleMouseMove)
    window.addEventListener(`mouseup`, this.handleMouseUp)
  }

  handleMouseUp(e) {
    window.removeEventListener(`mousemove`, this.handleMouseMove)
    window.removeEventListener(`mouseup`, this.handleMouseUp)
    if (this.direction) {
      if (this.props.afterResize) {
        this.props.afterResize({
          prevStyle: this.initialStyle,
          currentStyle: this.state.style,
          direction: this.direction
        })
      }
    }
    this.direction = null
    this.initialStyle = null
  }

  handleMouseMove(e) {
    let displacement = {
      x: e.clientX - this.initialPosition.x,
      y: e.clientY - this.initialPosition.y
    }
    let {style} = this.state

    if (this.direction) {
       style = this.handleResize[this.direction](displacement)
      if (this.props.onResize) {
        this.props.onResize({
          prevStyle: this.initialStyle,
          currentStyle: style,
          direction: this.direction
        })
      }
    }
    else {
      style = this.handleMove(displacement)
    }

    if (style !== this.state.style) {
      this.setState({style})
    }
  }

  handleMove(displacement) {
    return {
      ...this.state.style,
      top: this.initialStyle.top + displacement.y,
      left: this.initialStyle.left + displacement.x
    }
  }

  handleNorth(displacement) {
    return {
      ...this.state.style,
      top: this.initialStyle.top + displacement.y,
      height: this.initialStyle.height - displacement.y
    }
  }

  handleNorthEast(displacement) {
    return {
      ...this.state.style,
      top: this.initialStyle.top + displacement.y,
      width: this.initialStyle.width + displacement.x,
      height: this.initialStyle.height - displacement.y
    }
  }

  handleEast(displacement) {
    return {
      ...this.state.style,
      width: this.initialStyle.width + displacement.x
    }
  }

  handleSouthEast(displacement) {
    return {
      ...this.state.style,
      width: this.initialStyle.width + displacement.x,
      height: this.initialStyle.height + displacement.y
    }
  }

  handleSouth(displacement) {
    return {
      ...this.state.style,
      height: this.initialStyle.height + displacement.y
    }
  }

  handleSouthWest(displacement) {
    return {
      ...this.state.style,
      left: this.initialStyle.left + displacement.x,
      width: this.initialStyle.width - displacement.x,
      height: this.initialStyle.height + displacement.y
    }
  }

  handleWest(displacement) {
    return {
      ...this.state.style,
      left: this.initialStyle.left + displacement.x,
      width: this.initialStyle.width - displacement.x,
    }
  }

  handleNorthWest(displacement) {
    return {
      ...this.state.style,
      top: this.initialStyle.top + displacement.y,
      left: this.initialStyle.left + displacement.x,
      width: this.initialStyle.width - displacement.x,
      height: this.initialStyle.height - displacement.y
    }
  }

  renderCorners() {
    return (
    CORNERS.map((corner) => (
        <i
          key={corner.direction}
          className={`resizeable-corner ${corner.className}`}
          onMouseDown={this.handleStartResizing.bind(this, corner.direction)}
        />
      ))
    )
  }

  render() {
    let {children, moveable, resizeable} = this.props
    return (
      <div
        tabIndex="1"
        className={classnames(`transformable`, {moveable}, {resizeable})}
        style={this.state.style}
        onMouseDown={moveable && this.handleStartMoving}
      >

        <div className="transformable-children">
          {children}
        </div>
        {resizeable && this.renderCorners()}
      </div>
    )
  }
}
