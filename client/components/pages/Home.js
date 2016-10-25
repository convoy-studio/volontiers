import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import dom from 'dom-hand'

import Landing from '../partials/Landing'
import Preview from '../partials/Preview'

export default class Home extends Page {
  constructor(props) {
    super(props)
    this.unmountLanding = this.unmountLanding.bind(this)
    Store.on(Constants.PREVIEWS_LOADED, this.unmountLanding)
    this.state = { showLanding: true }
  }
  render() {
    return (
  		<div id='home-page' ref='page-wrapper' className='page-wrapper'>
  			{this.state.showLanding && <Landing/>}
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

  unmountLanding() {
    TweenMax.to(window, 1, { scrollTo: window.innerHeight, ease: Circ.easeOut, delay: 0.5, onComplete: () => {
      this.state.showLanding = false
      this.forceUpdate()
      dom.classes.add(dom.select('#home-page'), 'page-wrapper--fixed')
    }})
  }
}
