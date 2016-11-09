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

let showTitlesTimeout = undefined

export default class ProjectsOverview extends BaseComponent {
  constructor(props) {
    super(props)
    this.animationsState = STATE.DEACTIVE
  }
  componentWillMount() {
    this.onProjectClick = this.onProjectClick.bind(this)
    this.onBackgroundClick = this.onBackgroundClick.bind(this)
    this.onImgLoad = this.onImgLoad.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.open)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.close)
  }
  render() {
    const eventProjects = this.getMappedProjects(Constants.TYPE.EVENT)
    const retailProjects = this.getMappedProjects(Constants.TYPE.RETAIL)
    return (
      <div id='projects-overview' ref='parent'>
        <div ref="event-projects" className="event projects-container">{eventProjects}</div>
        <div ref="retail-projects" className="retail projects-container">{retailProjects}</div>
        <div className="titles-container">
          <MainTitle ref='eventTitle' rotation='-90deg' title='EVENT' className='link event-title'></MainTitle>
          <MainTitle ref='retailTitle' rotation='90deg' title='RETAIL' className='link retail-title'></MainTitle>
        </div>
        <div ref='background' className="background btn"></div>
      </div>
    )
  }
  componentDidMount() {
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
    const projects = Store.getProjectsByType(id)
    return projects.map((project, index) => {
      return (
        <li key={`${id}_${index}`} onClick={(e) => {e.preventDefault(); this.onProjectClick(project.slug)}} className="btn">
          <div className="project-container">
            <div className="title-holder">
              <div className="vertical-center-parent">
                <p className="vertical-center-child">{project.title}</p>
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
  open() {
    transitionShowTime = 0
    transitionHideTime = 0
    this.eventProjects.pos[0] = -initialPos
    this.retailProjects.pos[0] = initialPos
    this.animationsState = STATE.TRANSITION_IN
    dom.classes.add(this.refs.parent, 'open')
    clearTimeout(showTitlesTimeout)
    showTitlesTimeout = setTimeout(() => {
      this.refs.eventTitle.show()
      this.refs.retailTitle.show()
    }, 500)
    dom.event.on(this.refs.background, 'click', this.onBackgroundClick)
  }
  close() {
    clearTimeout(showTitlesTimeout)
    this.animationsState = STATE.TRANSITION_OUT
    setTimeout(() => { dom.classes.remove(this.refs.parent, 'open') }, 700)
    this.refs.eventTitle.hide()
    this.refs.retailTitle.hide()
    dom.event.off(this.refs.background, 'click', this.onBackgroundClick)
  }
  onBackgroundClick(e) {
    e.preventDefault()
    setTimeout(Actions.closeProjectsOverview)
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
    this.eventProjects.nx = Math.abs(Math.min(0, Store.Mouse.nX))
    this.retailProjects.nx = Math.abs(Math.max(0, Store.Mouse.nX))
    this.positionContainerDependsMousePosition(this.eventProjects, windowH)
    this.positionContainerDependsMousePosition(this.retailProjects, windowH)
    switch (this.animationsState) {
    case STATE.TRANSITION_IN:
      transitionShowTime += 0.01
      const easeIn = transitionShowBezier(transitionShowTime)
      this.eventProjects.pos[0] += (0 - this.eventProjects.pos[0]) * easeIn
      this.retailProjects.pos[0] += (0 - this.retailProjects.pos[0]) * easeIn
      if (transitionShowTime > 1.2) this.animationsState = STATE.ACTIVE
      break
    case STATE.TRANSITION_OUT:
      transitionHideTime += 0.01
      const easeOut = transitionHideBezier(transitionHideTime)
      this.eventProjects.pos[0] += (-initialPos - this.eventProjects.pos[0]) * easeOut
      this.retailProjects.pos[0] += (initialPos - this.retailProjects.pos[0]) * easeOut
      if (transitionHideTime > 1.2) this.animationsState = STATE.DEACTIVE
      break
    default:
    }
  }
  positionContainerDependsMousePosition(project, windowH) {
    project.norm[0] += (project.nx - project.norm[0]) * 0.1
    const nY = Store.Mouse.nY - 2
    const remain = (project.size[1] - windowH) * project.norm[0]
    const posY = (nY / 1) * (-remain)
    project.pos[1] += (posY - project.pos[1]) * 0.1
    Utils.translate(project.el, project.pos[0], project.pos[1], 1)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs.parent.style.width = windowW + 'px'
    this.refs.parent.style.height = windowH + 'px'
    this.eventProjects.el.style.top = (windowH >> 1) - (this.eventProjects.size[1] >> 1) + 'px'
    this.retailProjects.el.style.top = (windowH >> 1) - (this.retailProjects.size[1] >> 1) + 'px'
    setTimeout(() => {
      const eventT = this.refs.eventTitle
      const retailT = this.refs.retailTitle
      eventT.refs.parent.style.top = (eventT.size[0]) + (windowH >> 1) - (eventT.size[0] >> 1) + 'px'
      retailT.refs.parent.style.top = (windowH >> 1) - (retailT.size[0] >> 1) + 'px'
    }, 100)
  }
}
