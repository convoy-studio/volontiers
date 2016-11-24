import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import MainTitle from './MainTitle'

class PreviewLink extends BaseComponent {
  constructor(props) {
    super(props)
    this.projects = Store.getProjects()
    this.data = {
      slug: '/project/' + this.projects[0].slug
    }
    this.content = Store.getContent('preview')
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
      <MainTitle ref='previewLink' rotation='90deg' title={this.content.viewMore} onClick={this.onPreviewClicked} className='link preview-link' hasMouseEnterLeave={false}></MainTitle>
    )
  }
  update() {
    this.data.slug = '/project/' + this.projects[Store.CurrentPreviewIndex].slug
  }
  onPreviewClicked() {
    Router.setRoute(this.data.slug)
  }
  showLink(overview) {
    if (overview) Store.on(Constants.MOUSEENTER_PREVIEW, this.showLink)
    this.refs.previewLink.show()
  }
  hideLink(overview) {
    if (overview) Store.off(Constants.MOUSEENTER_PREVIEW, this.showLink)
    this.refs.previewLink.hide()
  }
  resize() {
    if (!this.refs.previewLink) return
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs.previewLink.refs.parent.style.top = (windowH >> 1) - (this.refs.previewLink.size[0] >> 1) + 'px'
    this.refs.previewLink.refs.parent.style.left = windowW - Constants.GLOBAL_MARGIN + 'px'
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEW_CHANGED, this.update)
    Store.off(Constants.MOUSEENTER_PREVIEW, this.showLink)
    Store.off(Constants.MOUSELEAVE_PREVIEW, this.hideLink)
  }
}

export default PreviewLink
