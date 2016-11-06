import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'
import Actions from '../actions'
import LangButton from './partials/LangButton'
import ProjectsOverview from './partials/ProjectsOverview'
import SVGComponent from './partials/SVGComponent'
import MainTitle from './partials/MainTitle'

export default class FrontContainer extends BaseComponent {
  constructor(props) {
    super(props)
    this.onProjectsClick = this.onProjectsClick.bind(this)
  }
  render() {
    return (
      <header id='front-container' ref='front-container' className="navigation">
        <MainTitle ref='projectsTitle' title={'Projects'} onClick={this.onProjectsClick} className='link top-projects-title'></MainTitle>
        <a href="home" className="navigation__center">
          <SVGComponent width='100%' viewBox="0 0 13 13">
            <polygon fillRule="evenodd" clipRule="evenodd" points="0.25,0.25 12.75,0.25 8.667,12.75 4.412,12.75"/>
          </SVGComponent>
        </a>
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
  }
  onProjectsClick() {
    if (Store.State === Constants.STATE.PROJECTS) setTimeout(Actions.closeProjectsOverview)
    else setTimeout(Actions.openProjectsOverview)
  }
  resize() {
    this.refs['projects-overview'].resize()
  }
}
