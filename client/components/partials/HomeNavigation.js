import BaseComponent from '../../pager/components/BaseComponent'
import Router from '../../services/router/'
import Store from '../../store/'
import Constants from '../../constants/'
import dom from 'dom-hand'

class HomeNavigation extends BaseComponent {
  constructor(props) {
    super(props)
    this.projects = this.props.projects
    this.hide = this.hide.bind(this)
    this.show = this.show.bind(this)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.hide)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.show)
  }
  render() {
    const projectsLinks = this.getProjectsLinks()
    return (
      <div className='home-navigation' ref='navigation'>
        {projectsLinks}
      </div>
    )
  }

  getProjectsLinks() {
    return this.projects.map((project, index) => {
      return (
        <div key={`${project.slug}_${index}`} className={`home-navigation__dot home-navigation__dot--${index} btn`} onClick={(e) => {e.preventDefault(); this.onProjectClick(project.slug)}}>
          <span></span>
        </div>
      )
    })
  }

  onProjectClick(slug)  {
    Router.setRoute(`/home/${slug}`)
  }

  updateProject(index) {
    if (dom.select('.home-navigation__dot--active')) {
      dom.classes.remove(dom.select('.home-navigation__dot--active'), 'home-navigation__dot--active')
    }
    dom.classes.add(dom.select(`.home-navigation__dot--${index}`), 'home-navigation__dot--active')
  }

  show() {
    TweenMax.to(this.refs.navigation, 0.2, { opacity: 1 })
  }

  hide() {
    TweenMax.to(this.refs.navigation, 0.2, { opacity: 0 })
  }

  componentWillUnmount() {
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, this.hide)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, this.show)
  }
}

export default HomeNavigation
