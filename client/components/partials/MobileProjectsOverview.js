import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Constants from '../../constants'
import Actions from '../../actions'
import Router from '../../services/router'
import Img from './Img'
import MainTitle from './MainTitle'
import dom from 'dom-hand'
import {PagerStore, PagerActions, PagerConstants} from '../../pager/Pager'

export default class MobileProjectsOverview extends BaseComponent {
  constructor(props) {
    super(props)
    this.projects = {
      EVENT: Store.getProjectsByType(Constants.TYPE.EVENT),
      RETAIL: Store.getProjectsByType(Constants.TYPE.RETAIL)
    }
    this.state = {
      event: false,
      productSpace: false
    }
    this.hidden = true
    this.needAnim = false
    this.content = Store.getContent('projectOverview')
  }
  componentWillMount() {
    this.onProjectClick = this.onProjectClick.bind(this)
    this.toggleOverlay = this.toggleOverlay.bind(this)
    this.hideOverlay = this.hideOverlay.bind(this)
    this.filter = this.filter.bind(this)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.toggleOverlay)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.toggleOverlay)
    Store.on(Constants.ROUTE_CHANGED, this.hideOverlay)
    Store.on(Constants.TOGGLE_ABOUT, this.hideOverlay)
  }
  render() {
    const noFilter = !this.state.event && !this.state.productSpace ? true : false
    const eventProjects = noFilter || this.state.event ? this.getMappedProjects(Constants.TYPE.EVENT) : null
    const retailProjects = noFilter || this.state.productSpace ? this.getMappedProjects(Constants.TYPE.RETAIL) : null
    return (
      <div id='mobile-projects-overview' ref='parent'>
        <div className="filters" ref="filters">
          <div className={`filter ${this.state.event ? 'filter--active' : ''}`} onClick={ () => this.filter('event') }>
            <div className="filter__item">
              <span className="filter__bullet"></span>
              <MainTitle hasMouseEnterLeave={false} className='btn' title={'Event'} />
            </div>
          </div>
          <div className={`filter ${this.state.productSpace ? 'filter--active' : ''}`} onClick={ () => this.filter('productSpace') }>
            <div className="filter__item">
              <span className="filter__bullet"></span>
              <MainTitle hasMouseEnterLeave={false} className='btn' title={'Product Space'} />
            </div>
          </div>
        </div>
        <div className="projects" ref="projects">
          {eventProjects}
          {retailProjects}
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.setupAnimations()
  }
  getMappedProjects(id) {
    const projects = this.projects[id]
    return projects.map((project, index) => {
      let projectName = project.project
      return (
        <li key={`${id}_${index}`} onClick={(e) => {e.preventDefault(); this.onProjectClick(project.slug)}} className="projects__item">
          <Img id={id} src={`assets/images/${project.slug}/overview.jpg`} />
            <div className="projects__infos">
                <h3>{project.brand}<br/>{projectName}</h3>
                <MainTitle hasMouseEnterLeave={false} className='btn' title={this.content.discover} />
            </div>
        </li>
      )
    })
  }
  filter( category ) {
    const state = {
      event: false,
      productSpace: false
    }
    state[category] = !this.state[category]
    this.needAnim = true
    TweenMax.to( this.refs.projects, 0.5, { opacity: 0, ease: Sine.easeIn, onComplete: () => {
      this.setState(state)
      this.refs.projects.scrollTop = 0
    } } )
  }
  componentDidUpdate() {
    if (this.needAnim) {
      TweenMax.to( this.refs.projects, 0.5, { opacity: 1, delay: 0.2, ease: Sine.easeOut, onComplete: () => {
        this.needAnim = false
      } } )
    }
  }
  setupAnimations() {
    this.tlOverlayIn = new TimelineMax({ paused: true })
    this.tlOverlayIn.set(this.refs.parent, { visibility: 'visible' }, 0)
    this.tlOverlayIn.to(this.refs.parent, 1, { opacity: 1, ease: Sine.easeInOut })
    this.tlOverlayIn.fromTo(this.refs.filters, 0.5, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 1)
    this.tlOverlayIn.fromTo(this.refs.projects, 0.5, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 1.25)
    this.tlOverlayIn.timeScale(1.5)

    this.tlOverlayOut = new TimelineMax({ paused: true })
    this.tlOverlayOut.to(this.refs.filters, 0.5, { opacity: 0, ease: Sine.easeInOut }, 0)
    this.tlOverlayOut.to(this.refs.projects, 0.5, { opacity: 0, ease: Sine.easeInOut }, 0.25)
    this.tlOverlayOut.to(this.refs.parent, 1, { opacity: 0, ease: Sine.easeInOut }, 1)
    this.tlOverlayOut.set(this.refs.parent, { visibility: 'hidden' }, 1.5)
  }
  toggleOverlay() {
    if (this.hidden) {
      this.hidden = false
      this.tlOverlayIn.play(0)
      this.refs.projects.scrollTop = 0
    } else {
      this.hidden = true
      this.tlOverlayOut.play(0)
    }
  }
  hideOverlay() {
    if ( !this.hidden ) setTimeout(Actions.closeProjectsOverview)
  }
  onProjectClick(id)  {
    Router.setRoute(`/project/${id}`)
  }
  resize() {
  }
}
