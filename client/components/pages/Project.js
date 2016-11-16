import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'
import Constants from '../../constants'
import Actions from '../../actions'
import Router from '../../services/router'
import ProjectInfos from '../partials/ProjectInfos'
import slideshow from '../partials/Slideshow'
import NextPreviousBtns from '../partials/NextPreviousBtns'
import MainTitle from '../partials/MainTitle'

export default class Project extends Page {
  constructor(props) {
    super(props)
    this.onProjectInformationsClick = this.onProjectInformationsClick.bind(this)
    this.onToggleProjectInfos = this.onToggleProjectInfos.bind(this)
    this.onSlideshowUpdated = this.onSlideshowUpdated.bind(this)
    this.projectOverviewOpened = this.projectOverviewOpened.bind(this)
    this.projectOverviewClosed = this.projectOverviewClosed.bind(this)
    Store.on(Constants.TOGGLE_PROJECT_INFOS, this.onToggleProjectInfos)
    Store.on(Constants.NEXT_SLIDE, this.onSlideshowUpdated)
    Store.on(Constants.PREVIOUS_SLIDE, this.onSlideshowUpdated)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.projectOverviewOpened)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.projectOverviewClosed)
    this.content = Store.getContent('project')
  }
  render() {
    const content = Store.getCurrentProject()
    const infoContent = Store.getCurrentAboutContent()
    const infoButton = infoContent.length > 10 ? (<MainTitle ref='projectInformations' title={this.content.viewInfos} hasMouseEnterLeave={true} onClick={this.onProjectInformationsClick} className='link bottom-project-informations'></MainTitle>) : undefined
    const projectInfo = infoButton ? (<ProjectInfos />) : undefined
    return (
      <div id='project-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <NextPreviousBtns ref='next-previous-btns' />
        <MainTitle ref='projectTitle' title={content.name} hasMouseEnterLeave={false} className='link bottom-project-title'></MainTitle>
        {infoButton}
        <MainTitle ref='projectCounter' title={`1/${content.assets.length}`} hasMouseEnterLeave={false} className='link bottom-project-counter'></MainTitle>
        {projectInfo}
      </div>
    )
  }
  componentDidMount() {
    this.container = new PIXI.Container()
    setTimeout(() => {Actions.addToCanvas(this.container)})
    this.slideshow = slideshow(this.container).load(() => {
      super.componentDidMount()
    })
  }
  willTransitionIn() {
    setTimeout(() => { super.willTransitionIn() }, 300)
  }
  didTransitionInComplete() {
    this.refs.projectTitle.show()
    if (this.refs.projectInformations) this.refs.projectInformations.show()
    this.refs.projectCounter.show()
    this.refs['next-previous-btns'].isActive = true
    this.refs['next-previous-btns'].show()
    super.didTransitionInComplete()
  }
  willTransitionOut() {
    this.refs.projectTitle.hide()
    if (this.refs.projectInformations) this.refs.projectInformations.hide()
    this.refs.projectCounter.hide()
    this.refs['next-previous-btns'].hide()
    this.refs['next-previous-btns'].isActive = false
    setTimeout(() => { super.willTransitionOut() }, 200)
  }
  didTransitionOutComplete() {
    this.slideshow.transitionOut()
    setTimeout(() => { super.didTransitionOutComplete() }, 300)
  }
  onProjectInformationsClick() {
    Actions.toggleProjectInfos()
  }
  onToggleProjectInfos() {
    if (Store.ProjectInfoIsOpened) {
      this.slideshow.hideCurrentSlide()
      this.refs.projectInformations.onMouseLeave()
      this.refs['next-previous-btns'].hide()
      this.refs['next-previous-btns'].isActive = false
      setTimeout(() => {
        if (this.refs.projectInformations) this.refs.projectInformations.updateState({title: this.content.closeInfos})
      }, 400)
    } else {
      this.slideshow.showCurrentSlide()
      if (this.refs.projectInformations) this.refs.projectInformations.updateState({title: this.content.viewInfos})
      this.refs['next-previous-btns'].show()
      this.refs['next-previous-btns'].isActive = true
    }
  }
  projectOverviewOpened() {
    this.refs.projectTitle.hide()
    this.refs.projectCounter.hide()
    if (this.refs.projectInformations) this.refs.projectInformations.hide()
    this.refs['next-previous-btns'].hide()
    this.refs['next-previous-btns'].isActive = false
  }
  projectOverviewClosed() {
    this.refs.projectTitle.show()
    this.refs.projectCounter.show()
    if (this.refs.projectInformations) this.refs.projectInformations.show()
    this.refs['next-previous-btns'].show()
    this.refs['next-previous-btns'].isActive = true
  }
  onSlideshowUpdated() {
    setTimeout(() => {
      this.refs.projectCounter.updateState({
        title: `${this.slideshow.counter.props.index + 1}/${this.slideshow.slides.length}`
      })
    })
  }
  update() {
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    const prevNx = Math.min(Store.Mouse.nX + 0.4, 0) * 0.2
    if (nextNx > 0) this.refs['next-previous-btns'].show(Constants.RIGHT)
    else if (prevNx < 0) this.refs['next-previous-btns'].show(Constants.LEFT)
    else this.refs['next-previous-btns'].hide()
    if (this.slideshow) this.slideshow.update()
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs['next-previous-btns'].resize()
    if (this.slideshow) this.slideshow.resize()
    super.resize()
  }
  componentWillUnmount() {
    this.slideshow.clear()
    Store.off(Constants.NEXT_SLIDE, this.onSlideshowUpdated)
    Store.off(Constants.PREVIOUS_SLIDE, this.onSlideshowUpdated)
    Store.off(Constants.TOGGLE_PROJECT_INFOS, this.onToggleProjectInfos)
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, this.projectOverviewOpened)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, this.projectOverviewClosed)
    setTimeout(() => {Actions.removeFromCanvas(this.container)})
    super.componentWillUnmount()
  }
}
