import React, { Component } from 'react'
import Store from '../../store'
import Constants from '../../constants'

export default class HelperLayer extends Component {
  componentWillMount() {
    this.testOrientation = this.testOrientation.bind(this)
    this.content = Store.getContent('help')
    Store.on(Constants.WINDOW_RESIZE, this.testOrientation)
  }
  render() {
    return (
      <div ref='parent' id='helper-layer'>
        <p ref='info' className='info-text'>{this.content.orientation}</p>
      </div>
    )
  }
  onBlock() {
    this.refs.parent.style.visibility = 'visible'
  }
  onUnBlock() {
    this.refs.parent.style.visibility = 'hidden'
  }
  testOrientation() {
    if (Store.Orientation === Constants.ORIENTATION.LANDSCAPE && Store.Detector.isMobile) {
      this.refs.parent.style.visibility = 'visible'
      this.refs.parent.style.opacity = 1
      this.refs.info.style.opacity = 1
    } else {
      this.refs.parent.style.visibility = 'hidden'
      this.refs.parent.style.opacity = 0
      this.refs.info.style.opacity = 0
    }
  }
}
