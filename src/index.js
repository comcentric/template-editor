import './base-styles/base.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import ImageEditor from './components/image-editor/'

ReactDOM.render(
  <ImageEditor mode="zoom" src="https://pixabay.com/static/uploads/photo/2016/02/04/20/48/background-1179915_960_720.png"/>
  , document.getElementById('app')
)
