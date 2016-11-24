import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'
import Actions from '../actions'
import Router from '../services/router'
import ProjectsOverview from './partials/ProjectsOverview'
import MainTitle from './partials/MainTitle'
import Logo from './partials/Logo'
import dom from 'dom-hand'
import {PagerStore, PagerActions, PagerConstants} from './../pager/Pager'

export default class FrontContainer extends BaseComponent {
  constructor(props) {
    super(props)
    this.onProjectsClick = this.onProjectsClick.bind(this)
    this.changeLangClick = this.changeLangClick.bind(this)
    this.aboutClick = this.aboutClick.bind(this)
    this.onTransitionInCompleted = this.onTransitionInCompleted.bind(this)
    this.onOverviewOpen = this.onOverviewOpen.bind(this)
    this.onOverviewClose = this.onOverviewClose.bind(this)
    this.content = Store.getContent('navigation')
    this.langRotation = Store.Detector.isMobile === true ? '90deg' : '0deg'
    PagerStore.on(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.onTransitionInCompleted)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.onOverviewClose)
  }
  render() {
    return (
      <header id='front-container' ref='front-container' className="navigation">
        <MainTitle ref='projectsTitle' title={this.content.projects} onClick={this.onProjectsClick} className='link top-projects-title'></MainTitle>
        <div className="navigation__center">
          <Logo ref='logo' className='top-logo-title'/>
        </div>
        <div className="navigation__right">
          <ul>
            <li>
              <MainTitle ref='aboutTitle' title={this.content.about} hasMouseEnterLeave={true} onClick={this.aboutClick} className='link top-logo-title'></MainTitle>
            </li>
            <li>
              <MainTitle ref='langTitle' title={'en | fr'} hasMouseEnterLeave={true} rotation={this.langRotation} onClick={this.changeLangClick} className='link top-logo-title'></MainTitle>
            </li>
          </ul>
        </div>
        <ProjectsOverview ref='projects-overview' />
      </header>
    )
  }
  componentDidMount() {
  }
  onTransitionInCompleted() {
    PagerStore.off(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.onTransitionInCompleted)
    setTimeout(() => {
      this.refs.projectsTitle.show()
      this.refs.logo.show()
      this.refs.langTitle.show()
      this.refs.aboutTitle.show()
    }, 200)
  }
  onOverviewOpen() {
    this.refs.langTitle.hide()
  }
  onOverviewClose() {
    this.refs.langTitle.show()
  }
  changeLangClick() {
    Actions.changeLang()
  }
  aboutClick() {
    Router.setRoute('/about')
  }
  onProjectsClick() {
    if (Store.State === Constants.STATE.PROJECTS) setTimeout(Actions.closeProjectsOverview)
    else setTimeout(Actions.openProjectsOverview)
  }
  update() {
    this.refs['projects-overview'].update()
  }
  resize() {
    this.refs['projects-overview'].resize()
  }
}
