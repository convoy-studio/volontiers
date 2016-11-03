import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import MainBtn from './MainBtn'

class PreviewLink extends BaseComponent {
  constructor(props) {
    super(props)
    this.projects = Store.getProjects()
    this.data = {
      slug: '/project/' + this.projects[0].slug
    }
    this.state = {
      showLink: false
    }
  }
  componentDidMount() {
    this.parent = this.refs.previewLink
    this.update = this.update.bind(this)
    Store.on(Constants.PREVIEW_CHANGED, this.update)
    Store.on(Constants.MOUSEENTER_PREVIEW, this.showLink)
    Store.on(Constants.MOUSELEAVE_PREVIEW, this.hideLink)
    setTimeout(() => {
      this.resize()
    }, 300)
  }
  render() {
    return (
      <MainBtn ref='previewLink' rotation='90deg' title='View more' onClick={this.onPreviewClicked} className='link preview-link'>View more</MainBtn>
    )
  }
  update() {
    // {/*<a href={this.data.slug} ref='previewLink' className='link preview-link'>View more</a>*/}
    this.data.slug = '/project/' + this.projects[Store.CurrentPreviewIndex].slug
    this.forceUpdate()
  }
  onPreviewClicked() {
    Router.setRoute(this.data.slug)
  }
  showLink() {
    // if (this.state.showLink === false) {
    //   TweenMax.to(this.parent, 0.2, {opacity: 1})
    //   this.state.showLink = true
    // }
  }
  hideLink() {
    // if (this.state.showLink === true) {
    //   TweenMax.to(this.parent, 0.2, {opacity: 0})
    //   this.state.showLink = false
    // }
  }
  show() {
    this.refs.previewLink.show()
  }
  hide() {
    this.refs.previewLink.hide()
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs.previewLink.refs.parent.style.top = (windowH >> 1) - (this.refs.previewLink.size[0] >> 1) + 'px'
    this.refs.previewLink.refs.parent.style.left = windowW - 40 + 'px'
  }
}

export default PreviewLink
