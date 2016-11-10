import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'
import Actions from '../actions'
import Router from '../services/router'
import LangButton from './partials/LangButton'
import ProjectsOverview from './partials/ProjectsOverview'
import MainTitle from './partials/MainTitle'
import dom from 'dom-hand'

export default class FrontContainer extends BaseComponent {
  constructor(props) {
    super(props)
    this.onProjectsClick = this.onProjectsClick.bind(this)
    this.onToggleProjectInfos = this.onToggleProjectInfos.bind(this)
    this.onLogoClick = this.onLogoClick.bind(this)
    Store.on(Constants.TOGGLE_PROJECT_INFOS, this.onToggleProjectInfos)
  }
  render() {
    return (
      <header id='front-container' ref='front-container' className="navigation">
        <MainTitle ref='projectsTitle' title={'Projects'} onClick={this.onProjectsClick} className='link top-projects-title'></MainTitle>
        <div className="navigation__center">
          <MainTitle ref='logoTitle' title={'Volontiers'} hasMouseEnterLeave={false} onClick={this.onLogoClick} className='link top-logo-title'></MainTitle>
        </div>
        <div className="navigation__right">
          <ul>
            <li>
              <LangButton lang="en"/>
            </li>
            <li className="navigation__spacer">—</li>
            <li>
              <LangButton lang="fr"/>
            </li>
            <li>
              <a href="/about" className="link">About</a>
            </li>
          </ul>
        </div>
        <ProjectsOverview ref='projects-overview' />
      </header>
    )
  }
  componentDidMount() {
    this.refs.projectsTitle.show()
    this.refs.logoTitle.show()
  }
  onToggleProjectInfos() {
    if (Store.ProjectInfoIsOpened) dom.classes.add(this.refs['front-container'], 'hide')
    else dom.classes.remove(this.refs['front-container'], 'hide')
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
