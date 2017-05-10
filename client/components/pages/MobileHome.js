import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import Preview from '../partials/MobilePreview'
import NextPreviousBtns from '../partials/NextPreviousBtns'
import MainTitle from '../partials/MainTitle'
import HomeNavigation from '../partials/HomeNavigation'
import SVGComponent from './../partials/SVGComponent'
import Hammer from 'hammerjs'
import Utils from './../../utils/Utils'

const activityHandler = Utils.countActivityHandler(650)

export default class Home extends Page {
  constructor(props) {
    super(props)
    this.didPreviewChange = this.didPreviewChange.bind(this)
    this.onDiscoverProjectClick = this.onDiscoverProjectClick.bind(this)
    this.scrollDown = this.scrollDown.bind(this)
    this.pan = this.pan.bind(this)
    this.projects = Store.getHomeProjects()
    this.content = Store.getContent('preview')
    this.oldRoute = Router.getOldRoute()
    this.shiftScale = Store.Detector.isMobile ? 0.5 : 1
    this.counter = -1
    this.state = {
      brand: '',
      project: ''
    }
  }
  render() {
    return (
      <div id='home-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <Preview ref='preview'/>
        <div className="home-scrollHelper" ref="scrollHelper" onClick={this.scrollDown}>
          <SVGComponent width="11" height="20" viewBox="0 0 11 20">
            <path d="M5.386534 20l5.386533-5.386534h-4.46384V0H4.46384v14.613466H0" fill="#F7A1FA" fillRule="evenodd"/>
          </SVGComponent>
        </div>
        <div className='home-helper' ref='helper'>
          <HomeNavigation ref='projectNavigation' projects={this.projects}></HomeNavigation>
          <div className='home-infos btn' onClick={this.onDiscoverProjectClick}>
            <div className='home-overflow'>
              <h2 className='home-title' ref='brand'>{this.state.brand}</h2>
            </div>
            <div className='home-overflow'>
              <h2 className='home-title' ref='project'>{this.state.project}</h2>
            </div>
            <div className='home-overflow'>
              <p className='home-label home-label--discover' ref='discover'>
                {this.content.discover}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount() {
    Store.on(Constants.PREVIEW_CHANGED, this.didPreviewChange)
    this.hammer = new Hammer(this.refs['page-wrapper'])
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL })
    this.hammer.on('pan', this.pan)
    super.componentDidMount()
    // Store.on(Constants.WINDOW_RESIZE, this.updateButtons)
  }
  pan(e) {
    if (activityHandler.isReady === false || Store.State === Constants.STATE.PROJECTS || Store.State === Constants.STATE.ABOUT) return
    activityHandler.count()
    const direction = e.additionalEvent
    switch (direction) {
    case 'panup':
      this.refs.preview.keyboardTriggered(Constants.DOWN)
      break
    case 'pandown':
      this.refs.preview.keyboardTriggered(Constants.UP)
      break
    default:
    }
  }
  scrollDown() {
    if (activityHandler.isReady === false || Store.State === Constants.STATE.PROJECTS || Store.State === Constants.STATE.ABOUT) return
    activityHandler.count()
    this.refs.preview.keyboardTriggered(Constants.DOWN)
  }
  willTransitionOut() {
    TweenMax.to(this.refs['page-wrapper'], 1, { opacity: 0, ease: Circ.easeOut, onComplete: () => super.willTransitionOut() })
  }
  willTransitionIn() {
    setTimeout(() => { super.willTransitionIn() }, 300)
  }
  didTransitionInComplete() {
    TweenMax.to(this.refs.helper, 1, { opacity: 1, ease: Circ.easeOut })
    TweenMax.to(this.refs.scrollHelper, 1, { opacity: 1, ease: Circ.easeOut })
    super.didTransitionInComplete()
  }
  onDiscoverProjectClick() {
    const project = this.projects[Store.CurrentPreviewIndex]
    const route = `/project/${project.slug}`
    Router.setRoute(route)
  }
  didPreviewChange(item) {
    this.counter++
    if ( this.counter === 1 ) TweenMax.to( this.refs.scrollHelper, 0.5, { opacity: 0, ease: Circ.easeOut, onComplete: () => { dom.classes.add( this.refs.scrollHelper, 'inactive' ) } } )
    const project = this.projects[item.previewIdx]
    let projectTitle = project.project.length > 25 ? project.project.substr(0, 25) + '...' : project.project
    let tl = undefined
    tl = new TimelineMax({
      onComplete: () => {
        tl.clear()
        const state = {
          brand: project.brand,
          project: projectTitle
        }
        this.setState(state)
      }
    })
    tl.to(this.refs.brand, 1, { y: -80 * this.shiftScale, ease: Circ.easeOutt }, 0)
    tl.to(this.refs.project, 1, { y: -80 * this.shiftScale, ease: Circ.easeOutt }, 0.02)
    tl.to(this.refs.discover, 1, { y: -80 * this.shiftScale, ease: Circ.easeOutt }, 0.04)
    tl.timeScale(2)
    this.refs.projectNavigation.updateProject(item.previewIdx)
  }
  componentDidUpdate() {
    let tl = undefined
    tl = new TimelineMax({
      delay: 0.02,
      onComplete: () => {
        tl.clear()
      }
    })
    tl.fromTo(this.refs.brand, 1, { y: 80 * this.shiftScale }, { y: 0, ease: Circ.easeOut }, 0)
    tl.fromTo(this.refs.project, 1, { y: 80 * this.shiftScale }, { y: 0, ease: Circ.easeOut }, 0.02)
    tl.fromTo(this.refs.discover, 1, { y: 80 * this.shiftScale }, { y: 0, ease: Circ.easeOut }, 0.04)
    tl.timeScale(2)
  }
  update() {
  }
  resize() {
    this.refs.preview.resize()
    super.resize()
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEW_CHANGED, this.didPreviewChange)
    this.hammer.off('pan', this.pan)
    super.componentWillUnmount()
  }
}
