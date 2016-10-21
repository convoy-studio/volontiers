import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'

import Landing from '../partials/Landing'

export default class Home extends Page {
  constructor(props) {
    super(props)
  }
  render() {
    return (
  		<div id='home-page' ref='page-wrapper' className='page-wrapper'>
  			<Landing/>
  		</div>
  	)
  }
  componentDidMount() {
    super.componentDidMount()
  }
  setupAnimations() {
    super.setupAnimations()
  }
  didTransitionInComplete() {
    super.didTransitionInComplete()
  }
  willTransitionIn() {
    super.willTransitionIn()
  }
  willTransitionOut() {
    super.willTransitionOut()
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    super.resize()
  }
  componentWillUnmount() {
    super.componentWillUnmount()
  }
}
