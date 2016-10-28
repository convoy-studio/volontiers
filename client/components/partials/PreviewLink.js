import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

class PreviewLink extends BaseComponent {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    Store.on(Constants.PREVIEW_CHANGED, this.update)
    Store.on(Constants.MOUSEENTER_PREVIEW, this.showLink)
    Store.on(Constants.MOUSELEAVE_PREVIEW, this.hideLink)
    this.data = {
      slug: '/project/' + Store.Previews[0].slug
    }
    this.state = {
      showLink: false
    }
  }
  render() {
    return (
      <a href={this.data.slug} ref='previewLink' className='link preview-link'>View more</a>
    )
  }
  update() {
    this.data.slug = '/project/' + Store.Previews[Store.CurrentPreviewIndex].slug
    this.forceUpdate()
  }
  showLink() {
    if (this.state.showLink === false) {
      TweenMax.to(this.refs.previewLink, 0.2, {opacity: 1})
      this.state.showLink = true
    }
  }
  hideLink() {
    if (this.state.showLink === true) {
      TweenMax.to(this.refs.previewLink, 0.2, {opacity: 0})
      this.state.showLink = false
    }
  }
}

export default PreviewLink
