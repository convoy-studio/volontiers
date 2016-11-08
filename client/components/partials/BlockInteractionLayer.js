import React, { Component } from 'react'
import Store from '../../store'
import Constants from '../../constants'

export default class BlockInteractionLayer extends Component {
  componentWillMount() {
    this.onBlock = this.onBlock.bind(this)
    this.onUnBlock = this.onUnBlock.bind(this)
    Store.on(Constants.BLOCK_INTERACTIVITY, this.onBlock)
    Store.on(Constants.UN_BLOCK_INTERACTIVITY, this.onUnBlock)
  }
  render() {
    return (
      <div ref='parent' id='block-interaction-layer'></div>
    )
  }
  onBlock() {
    this.refs.parent.style.visibility = 'visible'
  }
  onUnBlock() {
    this.refs.parent.style.visibility = 'hidden'
  }
}
