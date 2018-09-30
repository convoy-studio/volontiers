import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'
import Constants from '../../constants'
import Actions from '../../actions'
import ProjectInfos from '../partials/ProjectInfos'
import Router from '../../services/router'

import MainTitle from '../partials/MainTitle'
import Slideshow from '../partials/Slideshow'

export default class Project extends Page {
  constructor(props) {
    super(props)
    this.onProjectInformationsClick = this.onProjectInformationsClick.bind(this)
    this.onToggleProjectInfos = this.onToggleProjectInfos.bind(this)
    this.onSlideshowUpdated = this.onSlideshowUpdated.bind(this)
    this.projectOverviewOpened = this.projectOverviewOpened.bind(this)
    this.projectOverviewClosed = this.projectOverviewClosed.bind(this)
    this.updateButtons = this.updateButtons.bind(this)
    Store.on(Constants.TOGGLE_PROJECT_INFOS, this.onToggleProjectInfos)
    Store.on(Constants.NEXT_SLIDE, this.onSlideshowUpdated)
    Store.on(Constants.PREVIOUS_SLIDE, this.onSlideshowUpdated)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.projectOverviewOpened)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.projectOverviewClosed)
    Store.on(Constants.WINDOW_RESIZE, this.updateButtons)
    this.content = Store.getContent('project')
    this.projectData = Store.getCurrentProject()
    this.projectInfo = undefined
  }
  render() {
    const newRoute = Router.getNewRoute()
    const oldRoute = Router.getOldRoute()
    const projectContent = JSON.parse(JSON.stringify(this.projectData))
    if (oldRoute === undefined || oldRoute.type === Constants.PROJECT || !(oldRoute.type === Constants.HOME && oldRoute.target === newRoute.target)) {
      projectContent.assets.unshift(projectContent.preview)
    }
    const infoContent = Store.getCurrentAboutContent()
    const infoButton = infoContent.length > 10 ? (<MainTitle ref='projectInformations' title={this.content.viewInfos} hasMouseEnterLeave={true} onClick={this.onProjectInformationsClick} className='link bottom-project-informations'></MainTitle>) : undefined
    this.projectInfo = infoButton ? (<ProjectInfos />) : undefined
    const projectTitle = projectContent.brand + projectContent.separator + projectContent.project
    return (
      <div id='project-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <Slideshow slug={newRoute.target} data={projectContent.assets} onUpdate={this.onSlideshowUpdated} ref="slideshow"/>
        <MainTitle ref='projectTitle' title={projectTitle} hasMouseEnterLeave={false} className='link bottom-project-title'></MainTitle>
        {infoButton}
        <MainTitle ref='projectCounter' title='' hasMouseEnterLeave={false} className='link bottom-project-counter'></MainTitle>
        {this.projectInfo}
      </div>
    )
  }
  componentDidMount() {
    TweenMax.to(dom.select('html'), 0.5, {backgroundColor: '#ffffff', delay: 0.2 })
    this.refs.projectCounter.updateState({
      title: `${this.refs.slideshow.counter.props.index + 1}/${this.refs.slideshow.counter.props.total}`
    })
    super.componentDidMount()
  }
  willTransitionIn() {
    this.refs.slideshow.transitionIn()
    super.willTransitionIn()
  }
  didTransitionInComplete() {
    this.refs.projectTitle.show()
    if (this.refs.projectInformations) {
      this.refs.projectInformations.onUpdate()
      this.refs.projectInformations.show()
    }
    this.refs.projectCounter.show()
    super.didTransitionInComplete()
    setTimeout(Actions.introAnimationCompleted)
  }
  willTransitionOut() {
    this.refs.projectTitle.hide()
    if (this.refs.projectInformations) this.refs.projectInformations.hide()
    this.refs.projectCounter.hide()
    this.refs.slideshow.transitionOut()
    setTimeout(() => { super.willTransitionOut() }, 300)
  }
  onProjectInformationsClick() {
    Actions.toggleProjectInfos()
  }
  updateButtons() {
    this.refs.projectTitle.onUpdate()
    if (this.refs.projectInformations) {
      this.refs.projectInformations.onUpdate()
    }
    this.refs.projectCounter.onUpdate()
  }
  onToggleProjectInfos() {
    if (this.projectInfo === undefined) return
    if (Store.ProjectInfoIsOpened) {
      this.refs.slideshow.onToggleProjectInfos()
      this.refs.projectInformations.onMouseLeave()
      setTimeout(() => {
        if (this.refs.projectInformations) this.refs.projectInformations.updateState({title: this.content.closeInfos})
      }, 400)
    } else {
      this.refs.slideshow.onToggleProjectInfos()
      if (this.refs.projectInformations) this.refs.projectInformations.updateState({title: this.content.viewInfos})
    }
  }
  projectOverviewOpened() {
    this.refs.projectTitle.hide()
    this.refs.projectCounter.hide()
    this.refs.slideshow.onProjectsOverviewOpen()
    if (this.refs.projectInformations) this.refs.projectInformations.hide()
  }
  projectOverviewClosed() {
    this.refs.projectTitle.show()
    this.refs.projectCounter.show()
    this.refs.slideshow.onProjectsOverviewClose()
    if (this.refs.projectInformations) this.refs.projectInformations.show()
  }
  onSlideshowUpdated() {
    this.refs.projectCounter.updateState({
      title: `${this.refs.slideshow.counter.props.index + 1}/${this.refs.slideshow.counter.props.total}`
    })
  }
  resize() {
    this.refs.slideshow.resize()
    super.resize()
  }
  componentWillUnmount() {
    Store.off(Constants.NEXT_SLIDE, this.onSlideshowUpdated)
    Store.off(Constants.PREVIOUS_SLIDE, this.onSlideshowUpdated)
    Store.off(Constants.TOGGLE_PROJECT_INFOS, this.onToggleProjectInfos)
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, this.projectOverviewOpened)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, this.projectOverviewClosed)
    Store.off(Constants.WINDOW_RESIZE, this.updateButtons)
    super.componentWillUnmount()
  }
}
