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
  }
  componentWillMount() {
    Store.on(Constants.SLIDESHOW_STATE_CHANGED, this.slideshowStateChanged)
    Store.on(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.on(Constants.SCROLL_TRIGGERED, this.scrollTriggered)
  }
  render() {
    return (
      <div className='next-previous-container'>
        <MainTitle ref='previousBtn' rotation='90deg' title='Previous Image' eventId={PREVIOUS_IMAGE} onClick={this.onPreviousClicked} className='link previous'></MainTitle>
        <MainTitle ref='nextBtn' rotation='90deg' title='Next Image' eventId={NEXT_IMAGE} onClick={this.onNextClicked} className='link next'></MainTitle>
      </div>
    )
  }
  componentDidMount() {
    setTimeout(this.resize, 300)
  }
  goBack() {
    const currentRoute = Router.getNewRoute()
    Router.setRoute(`/home/${currentRoute.target}`)
  }
  goNext() {
    const next = Store.nextProject()
    Router.setRoute(`/project/${next.slug}`)
  }
  onPreviousClicked(e) {
    switch (e) {
    case PREVIOUS_IMAGE:
      Actions.previousSlide()
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
      Actions.nextSlide()
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
      if (!this.refs.previousBtn.isVisible) this.refs.previousBtn.show()
      break
    case Constants.RIGHT:
      if (!this.refs.nextBtn.isVisible) this.refs.nextBtn.show()
      break
    default:
    }
  }
  hide() {
    if (!this.isActive) return
    if (this.refs.previousBtn.isVisible) this.refs.previousBtn.hide()
    if (this.refs.nextBtn.isVisible) this.refs.nextBtn.hide()
  }
  slideshowStateChanged(state) {
    this.currentState = state
    if (state === Constants.SLIDESHOW.BEGIN) {
      this.refs.previousBtn.updateState({
        title: 'back',
        eventId: BACK
      })
    } else if (state === Constants.SLIDESHOW.END) {
      if (this.currentProject.assets.length <= 1) {
        this.refs.previousBtn.updateState({
          title: 'back',
          eventId: BACK
        })
      }
      this.refs.nextBtn.updateState({
        title: 'Discover next project',
        eventId: NEXT_PROJECT
      })
    } else {
      this.refs.previousBtn.updateState({
        title: 'previous image',
        eventId: PREVIOUS_IMAGE
      })
      this.refs.nextBtn.updateState({
        title: 'next image',
        eventId: NEXT_IMAGE
      })
    }
    this.resize()
  }
  keyboardTriggered(key) {
    if ((key === Constants.LEFT || key === Constants.DOWN) && this.currentState === Constants.SLIDESHOW.BEGIN) this.goBack()
    else if ((key === Constants.RIGHT || key === Constants.UP) && this.currentState === Constants.SLIDESHOW.END) this.goNext()
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
  componentWillUnmount() {
    Store.off(Constants.SLIDESHOW_STATE_CHANGED, this.slideshowStateChanged)
    Store.off(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.off(Constants.SCROLL_TRIGGERED, this.scrollTriggered)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs.previousBtn.refs.parent.style.top = (windowH >> 1) - (this.refs.previousBtn.size[0] >> 1) + 'px'
    this.refs.previousBtn.refs.parent.style.left = Constants.GLOBAL_MARGIN + this.refs.previousBtn.size[1] + 'px'
    this.refs.nextBtn.refs.parent.style.top = (windowH >> 1) - (this.refs.nextBtn.size[0] >> 1) + 'px'
    this.refs.nextBtn.refs.parent.style.left = windowW - Constants.GLOBAL_MARGIN + 'px'
  }
}

export default NextPreviousBtns
