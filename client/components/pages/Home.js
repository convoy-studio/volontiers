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
    this.openProject = this.openProject.bind(this)
    this.closeProject = this.closeProject.bind(this)
    this.routeChanged = this.routeChanged.bind(this)
    Store.on(Constants.OPEN_PROJECT, this.openProject)
    Store.on(Constants.CLOSE_PROJECT, this.closeProject)
    Store.on(Constants.ROUTE_CHANGED, this.routeChanged)
    Store.on(Constants.APP_START, this.routeChanged)
    this.state = {
      showLanding: true,
      showFooter: false
    }
  }
  render() {
    return (
      <div id='home-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        {/* {this.state.showLanding && <Landing/> */}
        <Preview ref='preview'/>
        <PreviewLink ref='preview-link'/>
        <NextPreviousBtns ref='next-previous-btns'/>
        <PreviewFooter/>
        {/*
        {!this.state.showLanding && <PreviewLink/>}
        {this.state.showFooter && <PreviewFooter/>}
        */}
      </div>
    )
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
    this.refs['next-previous-btns'].resize()
    super.resize()
  }
  openProject() {
    this.previewComponent.openProject()
  }
  closeProject() {
    this.previewComponent.closeProject()
  }
  routeChanged() {
    const route = Router.getNewRoute()
    switch (route.type) {
    case Constants.HOME:
      this.refs['preview-link'].show()
      this.refs['next-previous-btns'].hide()
      break
    case Constants.PROJECT:
      this.refs['next-previous-btns'].show()
      this.refs['preview-link'].hide()
      break
    default:
    }
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
