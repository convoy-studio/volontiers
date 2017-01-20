import BaseComponent from '../../pager/components/BaseComponent'
import Router from '../../services/router/'
import dom from 'dom-hand'

class HomeNavigation extends BaseComponent {
  constructor(props) {
    super(props)
    this.projects = this.props.projects
  }
  render() {
    const projectsLinks = this.getProjectsLinks()
    return (
      <div className='home-navigation'>
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
}

export default HomeNavigation
