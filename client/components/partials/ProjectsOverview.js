import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Constants from '../../constants'
import Actions from '../../actions'
import Utils from '../../utils/Utils'
import Router from '../../services/router'
import Img from './Img'
import MainTitle from './MainTitle'
import dom from 'dom-hand'
import bezier from 'cubic-bezier'
import {PagerStore, PagerConstants} from '../../pager/Pager'

const STATE = {
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE',
  TRANSITION_IN: 'TRANSITION_IN',
  TRANSITION_OUT: 'TRANSITION_OUT'
}

const transitionHideBezier = bezier(1, 0.01, 0.14, 1.01, 1000)
const transitionShowBezier = bezier(1, 0.01, 0.14, 1.01, 1000)
let transitionHideTime = 0
let transitionShowTime = 0
const initialPos = 400
const thumbW = 238
const thumbH = 159
const thumbHFull = 179
const mobileScale = 0.6

let showTitlesTimeout = undefined
let changeTextureTimeout = undefined

export default class ProjectsOverview extends BaseComponent {
  constructor(props) {
    super(props)
    this.animationsState = STATE.DEACTIVE
    this.activeProject = ''
    this.projects = {
      EVENT: Store.getProjectsByType(Constants.TYPE.EVENT),
      RETAIL: Store.getProjectsByType(Constants.TYPE.RETAIL)
    }
    this.state = {
      currentPage: '',
      currentProject: ''
    }
    this.currentEventPos = 0
    this.currentRetailPos = 0
    this.selectedProject = ''
    this.isMobile = Store.Detector.isMobile
    this.firstHover = true
  }
  componentWillMount() {
    this.onProjectClick = this.onProjectClick.bind(this)
    this.onBackgroundClick = this.onBackgroundClick.bind(this)
    this.onImgLoad = this.onImgLoad.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.didPageChange = this.didPageChange.bind(this)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.open)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.close)
    Store.on(Constants.ROUTE_CHANGED, this.didPageChange)
    PagerStore.on(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.pageTransitionOut)
  }
  render() {
    const eventProjects = this.getMappedProjects(Constants.TYPE.EVENT)
    const retailProjects = this.getMappedProjects(Constants.TYPE.RETAIL)
    return (
      <div id='projects-overview' ref='parent' className={this.state.currentPage}>
        <div ref="event-projects" className="event projects-container">{eventProjects}</div>
        <div ref="retail-projects" className="retail projects-container">{retailProjects}</div>
        <div className="titles-container">
          <MainTitle ref='eventTitle' rotation='90deg' title='event' className='link event-title'></MainTitle>
          <MainTitle ref='retailTitle' rotation='-90deg' title='product space' className='link retail-title'></MainTitle>
        </div>
        <div className="preview">
          <div className="preview__image" ref="previewImage"></div>
        </div>
        <div ref='background' className="background btn"></div>
      </div>
    )
  }
  pageTransitionOut() {
    const newRoute = Router.getNewRoute()
    const state = {
      currentPage: newRoute.type.toLowerCase(),
      currentProject: newRoute.target.toLowerCase()
    }
    this.setState(state)
  }
  componentDidMount() {
    this.eventProjectsHeight = (this.projects.EVENT.length + 3) * thumbHFull
    this.retailProjectsHeight = (this.projects.RETAIL.length + 6) * thumbHFull
    if (this.isMobile) {
      const eventProjectsEl = this.refs['event-projects']
      const retailProjectsEl = this.refs['retail-projects']
      this.eventProjectsLength = this.projects.EVENT.length * thumbW * mobileScale
      this.retailProjectsLength = this.projects.RETAIL.length * thumbW * mobileScale
      eventProjectsEl.style.width = this.eventProjectsLength + 'px'
      retailProjectsEl.style.width = this.retailProjectsLength + 'px'
    }
    this.direction = Constants.LEFT
    this.eventProjects = {
      el: this.refs['event-projects'],
      size: [0, 0],
      pos: [0, 0],
      norm: [0, 0],
      nx: 0
    }
    this.retailProjects = {
      el: this.refs['retail-projects'],
      size: [0, 0],
      pos: [0, 0],
      norm: [0, 0],
      nx: 0
    }
  }
  getMappedProjects(id) {
    const projects = this.projects[id]
    return projects.map((project, index) => {
      let projectName = project.project
      if (this.isMobile) {
        projectName = projectName.length > 25 ? projectName.substr(0, 25) + '...' : projectName
      }
      return (
        <li key={`${id}_${index}`} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={(e) => {e.preventDefault(); this.onProjectClick(project.slug)}} className={`btn ${project.slug}`} data-slug={project.slug}>
          <div className="project-container">
            <div className="title-holder">
              <div className="vertical-center-parent">
                <p className="vertical-center-child"><span>{project.brand}</span><br/>{projectName}</p>
              </div>
            </div>
            <div className="thumbnail-holder">
              <Img didLoad={this.onImgLoad} id={id} src={`assets/images/${project.slug}/overview.jpg`}></Img>
            </div>
          </div>
        </li>
      )
    })
  }
  onMouseEnter(e) {
    clearTimeout(changeTextureTimeout)
    const hovered = e.target.getAttribute('data-slug')
    if (this.selectedProject !== hovered) {
      this.selectedProject = hovered
      this.refs.previewImage.style.opacity = 0
      changeTextureTimeout = setTimeout(() => { this.changeTexture(this.selectedProject) }, 300)
    }
  }
  changeTexture = (slug) => {
    if (this.firstHover) {
      Actions.firstOverviewHovered()
      this.firstHover = false
    }
    const preview = Store.getProjectPreview(slug)
    this.refs.previewImage.style.backgroundImage = `url('/assets/images/${slug}/${preview}')`
    this.refs.previewImage.style.opacity = 1
  }
  onMouseLeave() {
    clearTimeout(changeTextureTimeout)
  }
  open() {
    transitionShowTime = 0
    transitionHideTime = 0
    this.firstHover = true
    this.selectedProject = ''
    this.eventProjects.pos[0] = -initialPos
    this.retailProjects.pos[0] = initialPos
    this.eventProjects.pos[1] = 0
    this.retailProjects.pos[1] = 0
    this.animationsState = STATE.TRANSITION_IN
    dom.classes.add(this.refs.parent, 'open')
    clearTimeout(showTitlesTimeout)
    showTitlesTimeout = setTimeout(() => {
      this.refs.eventTitle.show()
      this.refs.retailTitle.show()
    }, 100)
    dom.event.on(this.refs.background, 'click', this.onBackgroundClick)
    const newRoute = Router.getNewRoute()
    if (newRoute.type === Constants.HOME) {
      setTimeout(() => { this.changeTexture(newRoute.target) }, 600)
    }
  }
  close() {
    clearTimeout(showTitlesTimeout)
    this.animationsState = STATE.TRANSITION_OUT
    setTimeout(() => { dom.classes.remove(this.refs.parent, 'open') }, 600)
    this.refs.eventTitle.hide()
    this.refs.retailTitle.hide()
    this.refs.previewImage.style.opacity = 0
    dom.event.off(this.refs.background, 'click', this.onBackgroundClick)
  }
  didPageChange(item) {
    const route = Router.getNewRoute()
    // if (route.type === 'HOME' || route.type === 'PROJECT') {
    //   if (dom.select('#projects-overview .btn.hide') !== null) dom.classes.remove(dom.select('#projects-overview .btn.hide'), 'hide')
    //   dom.classes.add(dom.select(`#projects-overview .btn.${route.target}`), 'hide')
    // }
  }
  onBackgroundClick(e) {
    e.preventDefault()
    Router.setRoute(`/project/${this.selectedProject}`)
  }
  onProjectClick(id)  {
    Router.setRoute(`/project/${id}`)
  }
  onImgLoad(props, img) {
    let size
    switch (props.id) {
    case Constants.TYPE.EVENT:
      size = dom.size(this.eventProjects.el)
      this.eventProjects.size[0] = size[0]
      this.eventProjects.size[1] = size[1]
      break
    case Constants.TYPE.RETAIL:
      size = dom.size(this.retailProjects.el)
      this.retailProjects.size[0] = size[0]
      this.retailProjects.size[1] = size[1]
      break
    default:
    }
    this.resize()
  }
  update() {
    if (this.animationsState === STATE.DEACTIVE) return
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.direction = Store.Mouse.x > (windowW >> 1) ? Constants.RIGHT : Constants.LEFT
    const mouselimit = ( windowW / 2 - 250 ) / (windowW / 2)
    this.eventProjects.nx = Math.min(1, Math.abs(Math.min(0, Store.Mouse.nX / mouselimit)))
    this.retailProjects.nx = Math.min(1, Math.abs(Math.max(0, Store.Mouse.nX / mouselimit)))
    this.positionContainerDependsMousePosition(this.eventProjects, windowH, this.eventProjectsHeight, 0.05)
    this.positionContainerDependsMousePosition(this.retailProjects, windowH, this.retailProjectsHeight, 0.02)
    switch (this.animationsState) {
    case STATE.TRANSITION_IN:
      transitionShowTime += 0.02
      const easeIn = transitionShowBezier(transitionShowTime)
      this.eventProjects.pos[0] += (0 - this.eventProjects.pos[0]) * easeIn
      this.retailProjects.pos[0] += (0 - this.retailProjects.pos[0]) * easeIn
      if (transitionShowTime > 1) this.animationsState = STATE.ACTIVE
      break
    case STATE.TRANSITION_OUT:
      transitionHideTime += 0.02
      const easeOut = transitionHideBezier(transitionHideTime)
      if (this.isMobile) {
        this.eventProjects.pos[1] += (-initialPos - this.eventProjects.pos[1]) * easeOut
        this.retailProjects.pos[1] += (initialPos - this.retailProjects.pos[1]) * easeOut
      } else {
        this.eventProjects.pos[0] += (-initialPos - this.eventProjects.pos[0]) * easeOut
        this.retailProjects.pos[0] += (initialPos - this.retailProjects.pos[0]) * easeOut
      }
      if (transitionHideTime > 1) this.animationsState = STATE.DEACTIVE
      break
    default:
    }
  }
  positionContainerDependsMousePosition(project, windowH, height, smooth) {
    project.norm[0] += (project.nx - project.norm[0]) * 0.1
    const nY = Store.Mouse.nY - 2
    const remain = (height - windowH) * project.norm[0]
    const posY = (nY / 2) * (-remain)
    project.pos[1] += (posY - project.pos[1]) * smooth
    Utils.translate(project.el, project.pos[0], project.pos[1], 1)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    if (this.isMobile) return
    this.eventProjects.el.style.top = (windowH >> 1) - (this.eventProjects.size[1] >> 1) + 'px'
    this.retailProjects.el.style.top = (windowH >> 1) - (this.retailProjects.size[1] >> 1) + 'px'
    setTimeout(() => {
      const eventT = this.refs.eventTitle
      const retailT = this.refs.retailTitle
      eventT.refs.parent.style.top = (windowH >> 1) - (eventT.size[1] >> 1) + 'px'
      retailT.refs.parent.style.top = (windowH >> 1) - (retailT.size[1] >> 1) + 'px'
    }, 100)
  }
}
