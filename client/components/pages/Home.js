import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import dom from 'dom-hand'

import Landing from '../partials/Landing'
import Preview from '../partials/Preview'

export default class Home extends Page {
  constructor(props) {
    super(props)
  }
  render() {
    return (
  		<div id='home-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
  			<Landing/>
        <Preview/>
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
