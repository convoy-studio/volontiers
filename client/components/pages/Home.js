import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import Preview from '../partials/Preview'
import NextPreviousBtns from '../partials/NextPreviousBtns'
import MainTitle from '../partials/MainTitle'

export default class Home extends Page {
  constructor(props) {
    super(props)
    this.didPreviewChange = this.didPreviewChange.bind(this)
    this.onDiscoverProjectClick = this.onDiscoverProjectClick.bind(this)
    this.projectOverviewOpened = this.projectOverviewOpened.bind(this)
    this.projectOverviewClosed = this.projectOverviewClosed.bind(this)
    this.updateButtons = this.updateButtons.bind(this)
    this.projects = Store.getHomeProjects()
    this.content = Store.getContent('preview')
  }
  render() {
    return (
      <div id='home-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <Preview ref='preview'/>
        <MainTitle ref='projectTitle' title={''} hasMouseEnterLeave={true} onClick={this.onDiscoverProjectClick} className='link bottom-project-title'></MainTitle>
        <MainTitle ref='projectDiscover' title={this.content.discover} hasMouseEnterLeave={true} onClick={this.onDiscoverProjectClick} className='link bottom-project-informations'></MainTitle>
        <MainTitle ref='projectCounter' title={`1/${this.projects.length}`} hasMouseEnterLeave={false} className='link bottom-project-counter'></MainTitle>
      </div>
    )
  }
  componentDidMount() {
    Store.on(Constants.PREVIEW_CHANGED, this.didPreviewChange)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.projectOverviewOpened)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.projectOverviewClosed)
    Store.on(Constants.WINDOW_RESIZE, this.updateButtons)
    this.previewComponent = this.refs.preview
    const oldRoute = Router.getOldRoute()
    if (oldRoute === undefined) { // First load
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
    this.refs.projectTitle.hide()
    this.refs.projectDiscover.hide()
    this.refs.projectCounter.hide()
    this.refs.preview.transitionOut()
    setTimeout(() => { super.willTransitionOut() }, 700)
  }
  willTransitionIn() {
    this.refs.preview.transitionIn()
    setTimeout(() => { super.willTransitionIn() }, 300)
  }
  didTransitionInComplete() {
    this.refs.projectTitle.show()
    this.refs.projectDiscover.onUpdate()
    this.refs.projectDiscover.show()
    this.refs.projectCounter.show()
    super.didTransitionInComplete()
  }
  onDiscoverProjectClick() {
    const project = this.projects[Store.CurrentPreviewIndex]
    const route = `/project/${project.slug}`
    Router.setRoute(route)
  }
  didPreviewChange(item) {
    const project = this.projects[item.previewIdx]
    this.refs.projectTitle.updateState({
      title: project.title
    })
    setTimeout(() => {
      if (this.refs.projectCounter) {
        this.refs.projectCounter.updateState({
          title: `${item.previewIdx + 1}/${this.projects.length}`
        })
      }
    })
  }
  projectOverviewOpened() {
    this.refs.projectTitle.hide()
    this.refs.projectDiscover.hide()
    this.refs.projectCounter.hide()
  }
  projectOverviewClosed() {
    this.refs.projectTitle.show()
    this.refs.projectDiscover.show()
    this.refs.projectCounter.show()
  }
  update() {
    this.previewComponent.update()
  }
  updateButtons() {
    this.refs.projectTitle.onUpdate()
    this.refs.projectDiscover.onUpdate()
    this.refs.projectCounter.onUpdate()
  }
  resize() {
    this.refs.preview.resize()
    super.resize()
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEW_CHANGED, this.didPreviewChange)
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, this.projectOverviewOpened)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, this.projectOverviewClosed)
    Store.off(Constants.WINDOW_RESIZE, this.updateButtons)
    super.componentWillUnmount()
  }
}
