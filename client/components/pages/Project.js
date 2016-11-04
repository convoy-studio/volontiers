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
    this.state = {
      showLanding: true
    }
    this.content = Store.getCurrentProject()
    console.log(this.content)
  }
  render() {
    return (
      <div id='project-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <NextPreviousBtns ref='next-previous-btns' />
        <MainTitle ref='projectTitle' title={this.content.name} className='link bottom-project-title'></MainTitle>
        {/*
        this.state.showLanding && <Landing/>
        <ProjectImage slug={this.slug}/>
        <ProjectPreviousLink slug={this.slug}/>
        <ProjectNextLink slug={this.slug}/>
        <ProjectFooter slug={this.slug}/>
        <ProjectInfos slug={this.slug}/>
        */}
  		</div>
  	)
  }
  componentDidMount() {
    this.container = new PIXI.Container()
    setTimeout(() => {Actions.addToCanvas(this.container)})
    this.slideshow = slideshow(this.container).load(() => {})
    super.componentDidMount()
  }
  didTransitionInComplete() {
    this.refs.projectTitle.show()
    super.didTransitionInComplete()
  }
  setupAnimations() {
    super.setupAnimations()
  }
  willTransitionOut() {
    this.slideshow.transitionOut()
    setTimeout(() => {
      super.willTransitionOut()
    }, 700)
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
    setTimeout(() => {Actions.removeFromCanvas(this.container)})
    super.componentWillUnmount()
  }
}
