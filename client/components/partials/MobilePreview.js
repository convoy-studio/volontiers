import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import Utils from '../../utils/Utils'
import dom from 'dom-hand'
import counter from 'ccounter'
import {PagerActions} from '../../pager/Pager'

const activityHandler = Utils.countActivityHandler(650)

class Preview extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.UPDATE_PREVIEW_SLIDE, this.onUpdatePreviewSlide)
    this.oldSlide = undefined
    this.currentSlide = undefined
    this.slides = []
    this.projects = Store.getHomeProjects()
    this.counter = counter(this.projects.length)
    this.pixelRatio = Store.Detector.pixelRatio
  }
  render() {
    const projects = this.projects.map( ( project, i ) => {
      return (
        <a href={ `/project/${project.slug}` } key={ i } className="preview__item">
          <div className="preview__image" style={ {backgroundImage: `url(assets/${project.image})`} }></div>
        </a>
      )
    } )
    return (
      <div ref="preview" className="preview preview--mobile">
        { projects }
      </div>
    )
  }
  componentDidMount() {
    this.parent = this.refs.preview
    this.projects.forEach( ( project, i ) => {
      this.slides.push({ id: project.slug, state: Constants.STATE.ACTIVE } )
    } )
    this.slidesEl = dom.select.all( '.preview__item' )
  }
  onUpdatePreviewSlide(id) {
    for (let i = 0; i < this.slides.length; i++) {
      const s = this.slides[i]
      if (s.id === id) {
        this.counter.set(i)
        this.updateCurrentSlide()
        break
      }
    }
    PagerActions.pageTransitionDidFinish()
  }
  getSlideById(id) {
    let currentSlide = undefined
    for (let i = 0; i < this.slides.length; i++) {
      const s = this.slides[i]
      if (s.id === id) {
        currentSlide = s
        break
      }
    }
    return currentSlide
  }
  onScroll(direction) {
    if (activityHandler.isReady === false) return
    activityHandler.count()
    switch (direction) {
    case -1:
      this.counter.dec()
      break
    case 1:
      this.counter.inc()
      break
    default:
      this.counter.inc()
    }
    Router.setRoute(`/home/${this.slides[this.counter.props.index].id}`)
  }
  keyboardTriggered(key) {
    if (key === Constants.DOWN) this.onScroll(1)
    else if (key === Constants.UP) this.onScroll(-1)
  }
  updateCurrentSlide() {
    this.oldSlide = this.currentSlide
    this.currentSlide = this.slides[this.counter.props.index]
    setTimeout(() => { Actions.currentSlideChanged(this.currentSlide) })
    setTimeout(() => { Actions.changePreview(this.counter.props.index) })
    TweenMax.to( this.parent, 0.5, { y: -( this.counter.props.index * Store.Window.h ), ease: Expo.easeOut } )
  }
  transitionIn() {
    if (!this.currentSlide) return
    const oldRoute = Router.getOldRoute()
    if (oldRoute && (oldRoute.type === Constants.PROJECT || oldRoute.type === Constants.ABOUT)) this.currentSlide.show({from: Constants.LEFT, to: Constants.CENTER})
    else this.currentSlide.activate()
  }
  transitionOut() {
    if (!this.currentSlide) return
    this.currentSlide.hide({from: Constants.CENTER, to: Constants.LEFT})
  }
  componentWillUnmount() {
    Store.off(Constants.UPDATE_PREVIEW_SLIDE, this.onUpdatePreviewSlide)
    this.slides.length = 0
    this.slides = undefined
  }
  resize() {
    const windowH = Store.Window.h
    for ( let slide of this.slidesEl ) {
      dom.style( slide, { height: windowH + 'px' } )
    }
    TweenMax.set( this.parent, { y: -( this.counter.props.index * Store.Window.h ) } )
  }
}

export default Preview
