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
    this.content = Store.getContent('navigation')
    this.language = Store.getLang()
    this.toggleAboutInterval = undefined
    this.isMobile = Store.Detector.isMobile
    PagerStore.on(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.onTransitionInCompleted)
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
              <MainTitle ref='langTitleEn' title={'en'} hasMouseEnterLeave={langState.en} onClick={() => { this.changeLangClick('en') }} className='link top-logo-title lang-button lang-button--en'></MainTitle>
              <span ref="separator" className="lang-separator">|</span>
              <MainTitle ref='langTitleFr' title={'fr'} hasMouseEnterLeave={langState.fr} onClick={() => { this.changeLangClick('fr') }} className='link top-logo-title lang-button lang-button--fr'></MainTitle>
            </li>
          </ul>
        </div>
        { !this.isMobile && <ProjectsOverview ref='projects-overview' /> }
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
      TweenMax.from(this.refs.separator, 0.8, { opacity: 0 })
      this.refs.aboutTitle.show()
    }, 0)
  }
  changeLangClick(lang) {
    if (lang === this.language) return
    setTimeout(() => { Actions.changeLang() })
  }
  aboutClick() {
    clearInterval(this.toggleAboutInterval)
    if (Store.State === Constants.STATE.PROJECTS) {
      setTimeout(Actions.closeProjectsOverview)
      this.toggleAboutInterval = setInterval(() => {
        if (Store.State !== Constants.STATE.PROJECTS) {
          clearInterval(this.toggleAboutInterval)
          setTimeout(Actions.toggleAbout)
        }
      }, 100)
    } else {
      setTimeout(Actions.toggleAbout)
    }
  }
  onProjectsClick() {
    if (Store.State === Constants.STATE.PROJECTS) setTimeout(Actions.closeProjectsOverview)
    else setTimeout(Actions.openProjectsOverview)
  }
  update() {
    if (!this.isMobile) this.refs['projects-overview'].update()
  }
  resize() {
    if (!this.isMobile) this.refs['projects-overview'].resize()
  }
}
