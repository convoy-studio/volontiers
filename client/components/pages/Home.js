import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import Landing from '../partials/Landing'
import Preview from '../partials/Preview'
import PreviewFooter from '../partials/PreviewFooter'
import PreviewLink from '../partials/PreviewLink'
import NextPreviousBtns from '../partials/NextPreviousBtns'

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
        <Preview ref='preview'/>
        <PreviewLink ref='preview-link'/>
        <PreviewFooter/>
      </div>
    )
  }
  willTransitionOut() {
    super.willTransitionOut()
  }
  didTransitionOutComplete() {
    super.didTransitionOutComplete()
  }
  componentDidMount() {
    this.previewComponent = this.refs.preview
    super.componentDidMount()
  }
  update() {
    this.previewComponent.update()
  }
  resize() {
    this.refs.preview.resize()
    this.refs['preview-link'].resize()
    super.resize()
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
  componentWillUnmount() {
    super.componentWillUnmount()
  }
}
