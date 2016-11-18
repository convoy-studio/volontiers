import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Constants from '../../constants'
import Actions from '../../actions'
import Utils from '../../utils/Utils'
import Router from '../../services/router'
import Img from './Img'
import MainTitle from './MainTitle'
import dom from 'dom-hand'
import hammer from 'hammerjs'
import bezier from 'cubic-bezier'
import {PagerStore, PagerActions, PagerConstants} from '../../pager/Pager'

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
const mobileScale = 0.75

let showTitlesTimeout = undefined

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
      currentPage: ''
    }
    this.currentEventPos = 0
    this.currentRetailPos = 0
  }
  componentWillMount() {
    this.onProjectClick = this.onProjectClick.bind(this)
    this.onBackgroundClick = this.onBackgroundClick.bind(this)
    this.onImgLoad = this.onImgLoad.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
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
          <MainTitle ref='eventTitle' rotation='-90deg' title='event' className='link event-title'></MainTitle>
          <MainTitle ref='retailTitle' rotation='90deg' title='retail' className='link retail-title'></MainTitle>
        </div>
        <div ref='background' className="background btn"></div>
      </div>
    )
  }
  pageTransitionOut() {
    const newRoute = Router.getNewRoute()
    const state = {
      currentPage: newRoute.type.toLowerCase()
    }
    this.setState(state)
  }
  componentDidMount() {
    if (Store.Detector.isMobile) {
      const eventProjectsEl = this.refs['event-projects']
      const retailProjectsEl = this.refs['retail-projects']
      this.eventProjectsLength = this.projects.EVENT.length * thumbW * mobileScale
      this.retailProjectsLength = this.projects.RETAIL.length * thumbW * mobileScale
      eventProjectsEl.style.width = this.eventProjectsLength + 'px'
      retailProjectsEl.style.width = this.retailProjectsLength + 'px'
      this.eventHammer = new Hammer(eventProjectsEl)
      this.eventHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL })
      this.retailHammer = new Hammer(retailProjectsEl)
      this.retailHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL })
      this.panEvent = this.panEvent.bind(this)
      this.panRetail = this.panRetail.bind(this)
      this.eventHammer.on('pan', this.panEvent)
      this.retailHammer.on('pan', this.panRetail)
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
      return (
        <li key={`${id}_${index}`} onClick={(e) => {e.preventDefault(); this.onProjectClick(project.slug)}} className={`btn ${project.slug}`}>
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
    }, 300)
    dom.event.on(this.refs.background, 'click', this.onBackgroundClick)
  }
  close() {
    clearTimeout(showTitlesTimeout)
    this.animationsState = STATE.TRANSITION_OUT
    setTimeout(() => { dom.classes.remove(this.refs.parent, 'open') }, 600)
    this.refs.eventTitle.hide()
    this.refs.retailTitle.hide()
    dom.event.off(this.refs.background, 'click', this.onBackgroundClick)
  }
  didPageChange(item) {
    const route = Router.getNewRoute()
    if (route.type === 'HOME' || route.type === 'PROJECT') {
      if (dom.select('#projects-overview .btn.hide') !== null) dom.classes.remove(dom.select('#projects-overview .btn.hide'), 'hide')
      dom.classes.add(dom.select(`#projects-overview .btn.${route.target}`), 'hide')
    }
  }
  panEvent(e) {
    let newPos = this.currentEventPos + (e.deltaX * 0.1)
    if (newPos > 0) this.currentEventPos = 0
    else if (newPos < -(this.eventProjectsLength - thumbW * 1.5)) this.currentEventPos = -(this.eventProjectsLength - thumbW * 1.5)
    else this.currentEventPos = newPos
    this.refs['event-projects'].style.left = this.currentEventPos + 'px'
  }
  panRetail(e) {
    let newPos = this.currentRetailPos + (-e.deltaX * 0.1)
    if (newPos > 0) this.currentRetailPos = 0
    else if (newPos < -(this.retailProjectsLength - thumbW * 1.5)) this.currentRetailPos = -(this.retailProjectsLength - thumbW * 1.5)
    else this.currentRetailPos = newPos
    this.refs['retail-projects'].style.right = this.currentRetailPos + 'px'
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
      transitionShowTime += 0.02
      const easeIn = transitionShowBezier(transitionShowTime)
      this.eventProjects.pos[0] += (0 - this.eventProjects.pos[0]) * easeIn
      this.retailProjects.pos[0] += (0 - this.retailProjects.pos[0]) * easeIn
      if (transitionShowTime > 1) this.animationsState = STATE.ACTIVE
      break
    case STATE.TRANSITION_OUT:
      transitionHideTime += 0.02
      const easeOut = transitionHideBezier(transitionHideTime)
      this.eventProjects.pos[0] += (-initialPos - this.eventProjects.pos[0]) * easeOut
      this.retailProjects.pos[0] += (initialPos - this.retailProjects.pos[0]) * easeOut
      if (transitionHideTime > 1) this.animationsState = STATE.DEACTIVE
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
    if (Store.Detector.isMobile) return
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
