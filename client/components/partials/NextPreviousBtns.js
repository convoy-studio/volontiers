import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import MainTitle from './MainTitle'

const NEXT_IMAGE = 'NEXT_IMAGE'
const PREVIOUS_IMAGE = 'PREVIOUS_IMAGE'
const BACK = 'BACK'
const NEXT_PROJECT = 'NEXT_PROJECT'

class NextPreviousBtns extends BaseComponent {
  constructor(props) {
    super(props)
    this.onPreviousClicked = this.onPreviousClicked.bind(this)
    this.onNextClicked = this.onNextClicked.bind(this)
    this.slideshowStateChanged = this.slideshowStateChanged.bind(this)
    this.keyboardTriggered = this.keyboardTriggered.bind(this)
    this.scrollTriggered = this.scrollTriggered.bind(this)
    this.isActive = false
    this.currentProject = Store.getCurrentProject()
    this.content = Store.getContent('project')
    this.margin = Constants.GLOBAL_MARGIN
  }
  componentWillMount() {
    Store.on(Constants.SLIDESHOW_STATE_CHANGED, this.slideshowStateChanged)
    Store.on(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.on(Constants.SCROLL_TRIGGERED, this.scrollTriggered)
  }
  render() {
    return (
      <div className='next-previous-container' onMouseMove={this.onMouseMove}>
        <MainTitle ref='previousBtn' rotation='-90deg' title={this.content.previousImg} eventId={PREVIOUS_IMAGE} onClick={this.onPreviousClicked} className='link previous' hasMouseEnterLeave={false}></MainTitle>
        <MainTitle ref='nextBtn' rotation='90deg' title={this.content.nextImg} eventId={NEXT_IMAGE} onClick={this.onNextClicked} className='link next' hasMouseEnterLeave={false}></MainTitle>
      </div>
    )
  }
  goBack() {
    const oldRoute = Router.getOldRoute()
    const currentRoute = Router.getNewRoute()
    if (oldRoute !== undefined && oldRoute.type === Constants.PROJECT) {
      // setTimeout(Actions.goBack)
      Router.setRoute(`/project/${oldRoute.target}`)
    } else {
      Router.setRoute(`/home/${currentRoute.target}`)
    }
  }
  goNext() {
    const next = Store.nextProject()
    Router.setRoute(`/project/${next.slug}`)
  }
  onPreviousClicked(e) {
    switch (e) {
    case PREVIOUS_IMAGE:
      this.props.previous()
      break
    case BACK:
      this.goBack()
      break
    default:
    }
  }
  onNextClicked(e) {
    switch (e) {
    case NEXT_IMAGE:
      this.props.next()
      break
    case NEXT_PROJECT:
      this.goNext()
      break
    default:
    }
  }
  show(side) {
    if (!this.isActive) return
    switch (side) {
    case Constants.LEFT:
      this.refs.previousBtn.show()
      break
    case Constants.RIGHT:
      this.refs.nextBtn.show()
      break
    default:
    }
  }
  hide(side) {
    if (!this.isActive) return
    if (side) {
      switch (side) {
      case Constants.LEFT:
        this.refs.previousBtn.hide()
        break
      case Constants.RIGHT:
        this.refs.nextBtn.hide()
        break
      default:
      }
    } else {
      if (this.refs.previousBtn.isVisible) this.refs.previousBtn.hide()
      if (this.refs.nextBtn.isVisible) this.refs.nextBtn.hide()
    }
  }
  slideshowStateChanged(state) {
    if (state === Constants.SLIDESHOW.BEGIN) {
      this.refs.previousBtn.updateState({
        title: this.content.back,
        eventId: BACK
      })
    } else if (state === Constants.SLIDESHOW.END) {
      if (this.props.length <= 1) {
        this.refs.previousBtn.updateState({
          title: this.content.back,
          eventId: BACK
        })
      }
      dom.classes.add(this.refs.nextBtn.refs.parent, 'last')
      this.refs.nextBtn.updateState({
        title: this.content.discover,
        eventId: NEXT_PROJECT
      })
    } else {
      if (dom.classes.has(this.refs.nextBtn.refs.parent, 'last')) dom.classes.remove(this.refs.nextBtn.refs.parent, 'last')
      this.refs.previousBtn.updateState({
        title: this.content.previousImg,
        eventId: PREVIOUS_IMAGE
      })
      this.refs.nextBtn.updateState({
        title: this.content.nextImg,
        eventId: NEXT_IMAGE
      })
    }
    this.resize()
  }
  keyboardTriggered(key) {
    if ((key === Constants.LEFT) && this.currentState === Constants.SLIDESHOW.BEGIN) this.goBack()
    else if ((key === Constants.RIGHT) && this.currentState === Constants.SLIDESHOW.END) this.goNext()
  }
  scrollTriggered(direction) {
    if (Store.State === Constants.STATE.PROJECTS) return
    if (direction === -1 && this.currentState === Constants.SLIDESHOW.BEGIN) this.goBack()
    else if (direction === 1 && this.currentState === Constants.SLIDESHOW.END) this.goNext()
    else {
      switch (direction) {
      case -1:
        setTimeout(Actions.previousSlide)
        break
      case 1:
        setTimeout(Actions.nextSlide)
        break
      default:
        setTimeout(Actions.nextSlide)
      }
    }
  }
  onMouseMove = () => {
    const nextNx = Math.max(Store.Mouse.nX, 0)
    const prevNx = Math.min(Store.Mouse.nX, 0)
    if (nextNx > 0) {
      this.show(Constants.RIGHT)
      this.hide(Constants.LEFT)
    } else if (prevNx < 0) {
      this.show(Constants.LEFT)
      this.hide(Constants.RIGHT)
    } else this.hide()
  }
  componentWillUnmount() {
    Store.off(Constants.SLIDESHOW_STATE_CHANGED, this.slideshowStateChanged)
    Store.off(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.off(Constants.SCROLL_TRIGGERED, this.scrollTriggered)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs.previousBtn.refs.parent.style.top = (windowH >> 1) - (this.refs.previousBtn.size[0] >> 1) + 'px'
    this.refs.previousBtn.refs.parent.style.left = this.margin + this.refs.previousBtn.size[1] + 'px'
    this.refs.nextBtn.refs.parent.style.top = (windowH >> 1) - (this.refs.nextBtn.size[0] >> 1) + 'px'
    this.refs.nextBtn.refs.parent.style.left = windowW - this.margin + 'px'
  }
}

export default NextPreviousBtns
