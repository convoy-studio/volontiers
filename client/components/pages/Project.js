import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'
import Constants from '../../constants'
import Actions from '../../actions'
import Router from '../../services/router'
import Landing from '../partials/Landing'
import ProjectImage from '../partials/ProjectImage'
import ProjectFooter from '../partials/ProjectFooter'
import ProjectInfos from '../partials/ProjectInfos'
import ProjectPreviousLink from '../partials/ProjectPreviousLink'
import ProjectNextLink from '../partials/ProjectNextLink'
import slideshow from '../partials/Slideshow'
import NextPreviousBtns from '../partials/NextPreviousBtns'
import MainTitle from '../partials/MainTitle'

export default class Project extends Page {
  constructor(props) {
    super(props)
    this.onProjectInformationsClick = this.onProjectInformationsClick.bind(this)
    this.onToggleProjectInfos = this.onToggleProjectInfos.bind(this)
    this.onSlideshowUpdated = this.onSlideshowUpdated.bind(this)
    Store.on(Constants.TOGGLE_PROJECT_INFOS, this.onToggleProjectInfos)
    Store.on(Constants.NEXT_SLIDE, this.onSlideshowUpdated)
    Store.on(Constants.PREVIOUS_SLIDE, this.onSlideshowUpdated)
    this.state = { showLanding: true }
  }
  render() {
    const content = Store.getCurrentProject()
    return (
      <div id='project-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <NextPreviousBtns ref='next-previous-btns' />
        <MainTitle ref='projectTitle' title={content.name} hasMouseEnterLeave={false} className='link bottom-project-title'></MainTitle>
        <MainTitle ref='projectInformations' title={'View Informations'} hasMouseEnterLeave={true} onClick={this.onProjectInformationsClick} className='link bottom-project-informations'></MainTitle>
        <MainTitle ref='projectCounter' title={`1/${content.assets.length}`} hasMouseEnterLeave={false} className='link bottom-project-counter'></MainTitle>
        <ProjectInfos />
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
    super.willTransitionIn()
  }
  didTransitionInComplete() {
    this.refs.projectTitle.show()
    this.refs.projectInformations.show()
    this.refs.projectCounter.show()
    this.refs['next-previous-btns'].isActive = true
    this.refs['next-previous-btns'].show()
    super.didTransitionInComplete()
  }
  willTransitionOut() {
    this.slideshow.transitionOut()
    this.refs.projectTitle.hide()
    this.refs.projectInformations.hide()
    this.refs.projectCounter.hide()
    this.refs['next-previous-btns'].hide()
    this.refs['next-previous-btns'].isActive = false
    setTimeout(() => { super.willTransitionOut() }, 700)
  }
  onProjectInformationsClick() {
    Actions.toggleProjectInfos()
  }
  onToggleProjectInfos() {
    if (Store.ProjectInfoIsOpened) {
      this.slideshow.hideCurrentSlide()
      this.refs.projectInformations.updateState({title: 'close informations'})
    } else {
      this.slideshow.showCurrentSlide()
      this.refs.projectInformations.updateState({title: 'view informations'})
    }
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
    setTimeout(() => {Actions.removeFromCanvas(this.container)})
    super.componentWillUnmount()
  }
}
