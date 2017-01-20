import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import Preview from '../partials/Preview'
import NextPreviousBtns from '../partials/NextPreviousBtns'
import MainTitle from '../partials/MainTitle'
import HomeNavigation from '../partials/HomeNavigation'

export default class Home extends Page {
  constructor(props) {
    super(props)
    this.didPreviewChange = this.didPreviewChange.bind(this)
    this.onDiscoverProjectClick = this.onDiscoverProjectClick.bind(this)
    this.projectOverviewOpened = this.projectOverviewOpened.bind(this)
    this.projectOverviewClosed = this.projectOverviewClosed.bind(this)
    // this.updateButtons = this.updateButtons.bind(this)
    this.projects = Store.getHomeProjects()
    this.content = Store.getContent('preview')
    this.oldRoute = Router.getOldRoute()
    this.shiftScale = Store.Detector.isMobile ? 0.5 : 1
    this.state = {
      brand: '',
      project: ''
    }
  }
  render() {
    return (
      <div id='home-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <Preview ref='preview'/>
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
              <p className='home-label' ref='discover'>
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
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.projectOverviewOpened)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.projectOverviewClosed)
    // Store.on(Constants.WINDOW_RESIZE, this.updateButtons)
    this.previewComponent = this.refs.preview
    if (this.oldRoute === undefined) { // First load
      this.refs.preview.loadSlides(() => {
        super.componentDidMount()
      })
    } else {
      this.refs.preview.loadFirstSlide(() => {
        super.componentDidMount()
      })
    }
  }
  willTransitionOut() {
    TweenMax.to(this.refs.helper, 0.3, { opacity: 0, ease: Circ.easeOut })
    this.refs.preview.transitionOut()
    setTimeout(() => { super.willTransitionOut() }, 700)
  }
  willTransitionIn() {
    this.refs.preview.transitionIn()
    setTimeout(() => { super.willTransitionIn() }, 300)
  }
  didTransitionInComplete() {
    if (this.oldRoute === undefined) TweenMax.to(this.refs.helper, 1, { opacity: 1, ease: Circ.easeOut, delay: 4 })
    else TweenMax.to(this.refs.helper, 1, { opacity: 1, ease: Circ.easeOut, delay: 1 })
    super.didTransitionInComplete()
  }
  onDiscoverProjectClick() {
    const project = this.projects[Store.CurrentPreviewIndex]
    const route = `/project/${project.slug}`
    Router.setRoute(route)
  }
  didPreviewChange(item) {
    const project = this.projects[item.previewIdx]
    let projectTitle = project.project
    if (Store.Detector.isMobile) {
      projectTitle = projectTitle.length > 25 ? projectTitle.substr(0, 25) + '...' : projectTitle
    }
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
  projectOverviewOpened() {
    TweenMax.to(this.refs.helper, 0.3, { opacity: 0, ease: Circ.easeOut })
  }
  projectOverviewClosed() {
    TweenMax.to(this.refs.helper, 0.3, { opacity: 1, ease: Circ.easeOut })
  }
  update() {
    this.previewComponent.update()
  }
  resize() {
    this.refs.preview.resize()
    super.resize()
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEW_CHANGED, this.didPreviewChange)
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, this.projectOverviewOpened)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, this.projectOverviewClosed)
    super.componentWillUnmount()
  }
}
