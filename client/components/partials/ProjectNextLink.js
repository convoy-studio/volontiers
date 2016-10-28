import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'

import dom from 'dom-hand'

class ProjectNextLink extends BaseComponent {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.slug = this.props.slug
    let idx = Store.ProjectsSlugs.indexOf(this.slug)
    let nextIndex = idx === Store.ProjectsSlugs.length - 1 ? 0 : idx + 1
    let nextSlug = '/project/' + Store.ProjectsSlugs[nextIndex]
    Store.on(Constants.PROJECT_SLIDE_CHANGED, this.update)
    Store.on(Constants.MOUSEENTER_RIGHT_PROJECT, this.showLink)
    Store.on(Constants.MOUSELEAVE_RIGHT_PROJECT, this.hideLink)
    this.data = {
      text: 'Next Image',
      nextPage: 2,
      totalPages: Object.keys(Data.projects[this.slug]).length,
      nextProject: nextSlug
    }
    this.state = {
      showLink: false
    }
  }
  render() {
    return (
        <a href='#' ref='nextProjectLink' className='link project-next-link' onClick={this.mouseClick}>
          {this.data.text}
          { Store.CurrentProjectSlideIndex < this.data.totalPages - 1 ? (
            <span>{this.data.nextPage}/{this.data.totalPages}</span>
            ) : null
          }
        </a>
    )
  }
  update() {
    if (Store.CurrentProjectSlideIndex < this.data.totalPages - 1) {
      this.data.nextPage = Store.CurrentProjectSlideIndex + 2
      if (this.data.text === 'Next Project') this.data.text = 'Next Image'
      if (this.refs.nextProjectLink.style.pointerEvents === 'auto') this.refs.nextProjectLink.style.pointerEvents = 'none'
      this.forceUpdate()
    } else {
      this.refs.nextProjectLink.style.pointerEvents = 'auto'
      this.data.text = 'Next Project'
    }
    this.forceUpdate()
  }
  mouseClick(e) {
    e.preventDefault()
    if (Store.CurrentProjectSlideIndex === this.data.totalPages - 1) {
      Router.setRoute(this.data.nextProject)
    }
  }
  showLink() {
    if (this.state.showLink === false) {
      TweenMax.to(this.refs.nextProjectLink, 0.2, {opacity: 1})
      this.state.showLink = true
    }
  }
  hideLink() {
    if (this.state.showLink === true) {
      TweenMax.to(this.refs.nextProjectLink, 0.2, {opacity: 0})
      this.state.showLink = false
    }
  }
}

export default ProjectNextLink
