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
  }
  componentDidMount() {
    this.update = this.update.bind(this)
    this.showLink = this.showLink.bind(this)
    this.hideLink = this.hideLink.bind(this)
    Store.on(Constants.PREVIEW_CHANGED, this.update)
    Store.on(Constants.MOUSEENTER_PREVIEW, this.showLink)
    Store.on(Constants.MOUSELEAVE_PREVIEW, this.hideLink)
    setTimeout(() => { this.resize() }, 300)
  }
  render() {
    return (
      <MainBtn ref='previewLink' rotation='90deg' title='View more' onClick={this.onPreviewClicked} className='link preview-link'></MainBtn>
    )
  }
  update() {
    this.data.slug = '/project/' + this.projects[Store.CurrentPreviewIndex].slug
  }
  onPreviewClicked() {
    Router.setRoute(this.data.slug)
  }
  showLink() {
    this.refs.previewLink.show()
  }
  hideLink() {
    this.refs.previewLink.hide()
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs.previewLink.refs.parent.style.top = (windowH >> 1) - (this.refs.previewLink.size[0] >> 1) + 'px'
    this.refs.previewLink.refs.parent.style.left = windowW - 40 + 'px'
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEW_CHANGED, this.update)
    Store.off(Constants.MOUSEENTER_PREVIEW, this.showLink)
    Store.off(Constants.MOUSELEAVE_PREVIEW, this.hideLink)
  }
}

export default PreviewLink
