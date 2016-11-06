import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Constants from '../../constants'

export default class ProjectsOverview extends BaseComponent {
  constructor(props) {
    super(props)
    this.eventProjects = Store.getProjectsByType(Constants.TYPE.EVENT)
    this.retailProjects = Store.getProjectsByType(Constants.TYPE.RETAIL)
  }
  componentWillMount() {
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.open)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.close)
  }
  render() {
    const eventProjects = this.getMappedProjects('event', this.eventProjects)
    const retailProjects = this.getMappedProjects('retail', this.retailProjects)
    return (
      <div id='projects-overview' ref='parent'>
        <div className="event projects-container">{eventProjects}</div>
        <div className="retail projects-container">{retailProjects}</div>
      </div>
    )
  }
  getMappedProjects(id, projects) {
    return projects.map((project, index) => {
      return (
        <li key={`${id}_${index}`} className="btn">
          <div className="project-container">
            <div className="title-holder">
              <div className="vertical-center-parent">
                <p className="vertical-center-child">{project.title}</p>
              </div>
            </div>
            <div className="thumbnail-holder">
              <img src={`assets/${project.image}`}></img>
            </div>
          </div>
        </li>
      )
    })
  }
  open() {
    console.log('open')
  }
  close() {
    console.log('close')
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs.parent.style.width = windowW + 'px'
    this.refs.parent.style.height = windowH + 'px'
  }
}
