import Page from '../Page'
import Store from '../../store'
import Data from '../../data'
import Constants from '../../constants'
import dom from 'dom-hand'
import Landing from '../partials/Landing'
import Preview from '../partials/Preview'
import PreviewFooter from '../partials/PreviewFooter'
import PreviewLink from '../partials/PreviewLink'

export default class Home extends Page {
  constructor(props) {
    super(props)
    // this.unmountLanding = this.unmountLanding.bind(this)
    // Store.on(Constants.PREVIEWS_LOADED, this.unmountLanding)
    this.state = {
      showLanding: true,
      showFooter: false
    }
  }
  render() {
    return (
  		<div id='home-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
  			{/* {this.state.showLanding && <Landing/> */}
        <Preview/>
        {/*
        {!this.state.showLanding && <PreviewLink/>}
        {this.state.showFooter && <PreviewFooter/>}
        */}
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
    let tl = new TimelineMax()
    tl.to(dom.select('#home-page .landing'), 0.5, {opacity: 0, ease: Power2.easeIn})
    tl.to(dom.select('#home-page .landing'), 1, { height: 0, ease: Circ.easeOut, delay: 0.5, onComplete: () => {
      this.state.showLanding = false
      this.state.showFooter = true
      this.forceUpdate()
    }}, '-=0.2')
  }
}
