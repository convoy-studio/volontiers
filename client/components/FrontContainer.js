import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'
import Actions from '../actions'
import Router from '../services/router'
import ProjectsOverview from './partials/ProjectsOverview'
import MainTitle from './partials/MainTitle'
import dom from 'dom-hand'
import {PagerStore, PagerActions, PagerConstants} from './../pager/Pager'

export default class FrontContainer extends BaseComponent {
  constructor(props) {
    super(props)
    this.onProjectsClick = this.onProjectsClick.bind(this)
    this.onLogoClick = this.onLogoClick.bind(this)
    this.changeLangClick = this.changeLangClick.bind(this)
    this.aboutClick = this.aboutClick.bind(this)
    this.onTransitionInCompleted = this.onTransitionInCompleted.bind(this)
    this.content = Store.getContent('navigation')
    PagerStore.on(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.onTransitionInCompleted)
  }
  render() {
    return (
      <header id='front-container' ref='front-container' className="navigation">
        <MainTitle ref='projectsTitle' title={this.content.projects} onClick={this.onProjectsClick} className='link top-projects-title'></MainTitle>
        <div className="navigation__center">
          <h1><MainTitle ref='logoTitle' title={'Volontiers'} hasMouseEnterLeave={false} onClick={this.onLogoClick} className='link top-logo-title'></MainTitle></h1>
        </div>
        <div className="navigation__right">
          <ul>
            <li>
              <MainTitle ref='langTitle' title={'en | fr'} hasMouseEnterLeave={false} onClick={this.changeLangClick} className='link top-logo-title'></MainTitle>
            </li>
            <li>
              <MainTitle ref='aboutTitle' title={this.content.about} hasMouseEnterLeave={false} onClick={this.aboutClick} className='link top-logo-title'></MainTitle>
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
      this.refs.logoTitle.show()
      this.refs.langTitle.show()
      this.refs.aboutTitle.show()
    }, 200)
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
  onLogoClick() {
    Router.setRoute(Store.defaultRoute())
  }
  update() {
    this.refs['projects-overview'].update()
  }
  resize() {
    this.refs['projects-overview'].resize()
  }
}
