import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'
import Data from '../../data'
import Constants from '../../constants'
import Router from '../../services/router'
import Landing from '../partials/Landing'
import ProjectImage from '../partials/ProjectImage'
import ProjectFooter from '../partials/ProjectFooter'
import ProjectInfos from '../partials/ProjectInfos'
import ProjectPreviousLink from '../partials/ProjectPreviousLink'
import ProjectNextLink from '../partials/ProjectNextLink'

export default class Project extends Page {
  constructor(props) {
    super(props)
    this.slug = props.hash.target
    this.data = Data.projects[this.slug]
    this.unmountLanding = this.unmountLanding.bind(this)
    Store.on(Constants.PROJECT_IMAGES_LOADED, this.unmountLanding)
    this.state = {
      showLanding: true
    }
  }
  render() {
    return (
  		<div id='project-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        {this.state.showLanding && <Landing/>}
        <ProjectImage slug={this.slug}/>
        <ProjectPreviousLink slug={this.slug}/>
        <ProjectNextLink slug={this.slug}/>
        <ProjectFooter slug={this.slug}/>
        <ProjectInfos slug={this.slug}/>
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
    tl.to(dom.select('#project-page .landing'), 0.5, {opacity: 0, ease: Power2.easeIn})
    tl.to(dom.select('#project-page .landing'), 1, { height: 0, ease: Circ.easeOut, delay: 0.5, onComplete: () => {
      this.state.showLanding = false
      this.forceUpdate()
    }}, '-=0.2')
  }
}
