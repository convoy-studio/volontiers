import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'

class ProjectPreviousLink extends BaseComponent {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.slug = this.props.slug
    Store.on(Constants.PROJECT_SLIDE_CHANGED, this.update)
    Store.on(Constants.MOUSEENTER_LEFT_PROJECT, this.showLink)
    Store.on(Constants.MOUSELEAVE_LEFT_PROJECT, this.hideLink)
    this.data = {
      text: 'Back',
      previousPage: 1,
      totalPages: Object.keys(Data.projects[this.slug]).length
    }
    this.state = {
      showLink: false
    }
  }
  render() {
    return (
      <a href='#' ref='previousProjectLink' className='link project-previous-link' onClick={this.mouseClick}>
        {this.data.text}
        { Store.CurrentProjectSlideIndex > 0 ? (
          <span>{this.data.previousPage}/{this.data.totalPages}</span>
          ) : null
        }
      </a>
    )
  }
  update() {
    if (Store.CurrentProjectSlideIndex > 0) {
      this.data.previousPage = Store.CurrentProjectSlideIndex
      if (this.data.text === 'Back') this.data.text = 'Previous Image'
      if (this.refs.previousProjectLink.style.pointerEvents === 'auto' || this.refs.previousProjectLink.style.pointerEvents === '') this.refs.previousProjectLink.style.pointerEvents = 'none'
      this.forceUpdate()
    } else {
      this.refs.previousProjectLink.style.pointerEvents = 'auto'
      this.data.text = 'Back'
    }
    this.forceUpdate()
  }
  mouseClick(e) {
    if (Store.CurrentProjectSlideIndex === 0) {
      Router.setRoute('/home')
    } else {
      e.preventDefault()
    }
  }
  showLink() {
    if (this.state.showLink === false) {
      TweenMax.to(this.refs.previousProjectLink, 0.2, {opacity: 1})
      this.state.showLink = true
    }
  }
  hideLink() {
    if (this.state.showLink === true) {
      TweenMax.to(this.refs.previousProjectLink, 0.2, {opacity: 0})
      this.state.showLink = false
    }
  }
}

export default ProjectPreviousLink
