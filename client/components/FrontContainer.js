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
    this.language = Store.getLang()
    this.langRotation = Store.Detector.isMobile === true ? '90deg' : '0deg'
    PagerStore.on(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.onTransitionInCompleted)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.onOverviewClose)
  }
  render() {
    const langState = {}
    if (this.language === 'fr') {
      langState.fr = false
      langState.en = true
    } else {
      langState.en = false
      langState.fr = true
    }
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
              <MainTitle ref='langTitleEn' title={'en'} hasMouseEnterLeave={langState.en} rotation={this.langRotation} onClick={() => { this.changeLangClick('en') }} className='link top-logo-title lang-button lang-button--en'></MainTitle>
              <span className="lang-separator">|</span>
              <MainTitle ref='langTitleFr' title={'fr'} hasMouseEnterLeave={langState.fr} rotation={this.langRotation} onClick={() => { this.changeLangClick('fr') }} className='link top-logo-title lang-button lang-button--fr'></MainTitle>
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
      this.refs.langTitleEn.show()
      this.refs.langTitleFr.show()
      this.refs.aboutTitle.show()
    }, 200)
  }
  onOverviewOpen() {
    this.refs.langTitleEn.hide()
    this.refs.langTitleFr.hide()
  }
  onOverviewClose() {
    this.refs.langTitleEn.show()
    this.refs.langTitleFr.show()
  }
  changeLangClick(lang) {
    if (lang === this.language) return
    setTimeout(() => { Actions.changeLang() })
  }
  aboutClick() {
    if (Store.CurrentSlide.state === Constants.STATE.ACTIVE) {
      setTimeout(() => { Actions.toggleAbout() })
    }
  }
  onProjectsClick() {
    if (Store.State === Constants.STATE.PROJECTS) setTimeout(Actions.closeProjectsOverview)
    if (Store.CurrentSlide.state === Constants.STATE.ACTIVE) setTimeout(Actions.openProjectsOverview)
  }
  update() {
    this.refs['projects-overview'].update()
  }
  resize() {
    this.refs['projects-overview'].resize()
  }
}
