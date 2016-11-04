import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import MainBtn from './MainBtn'

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
  }
  componentWillMount() {
    Store.on(Constants.SLIDESHOW_STATE_CHANGED, this.slideshowStateChanged)
  }
  render() {
    return (
      <div className='next-previous-container'>
        <MainBtn ref='previousBtn' rotation='90deg' title='Previous Image' eventId={PREVIOUS_IMAGE} onClick={this.onPreviousClicked} className='link previous'></MainBtn>
        <MainBtn ref='nextBtn' rotation='90deg' title='Next Image' eventId={NEXT_IMAGE} onClick={this.onNextClicked} className='link next'></MainBtn>
      </div>
    )
  }
  componentDidMount() {
    setTimeout(this.resize, 300)
  }
  onPreviousClicked(e) {
    // console.log(e)
    switch (e) {
    case PREVIOUS_IMAGE:
      Actions.previousSlide()
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
      const next = Store.nextProject()
      Router.setRoute(`/project/${next.slug}`)
      break
    default:
    }
  }
  show(side) {
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
  hide() {
    this.refs.previousBtn.hide()
    this.refs.nextBtn.hide()
  }
  slideshowStateChanged(state) {
    if (state === Constants.SLIDESHOW.BEGIN) {
      this.refs.previousBtn.updateState({
        title: 'back',
        eventId: BACK
      })
    } else if (state === Constants.SLIDESHOW.END) {
      this.refs.nextBtn.updateState({
        title: 'next project',
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
