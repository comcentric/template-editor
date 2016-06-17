import React from 'react'
import Transformable from '../transformable/'
import './styles/image-editor.scss'

const MODE_MAP = {
  stretch: `100% 100%`,
  fill: `cover`,
  zoom: `contain`
}

export default class ImageEditor extends React.Component {
  render() {
    let {src, mode, ...other} = this.props
    return (
      <Transformable moveable resizeable {...other}>
        <div
          className="image-editor"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: MODE_MAP[mode]
          }}>
        </div>
      </Transformable>
    )
  }
}

ImageEditor.defaultProps = {
  mode: `stretch`
}
