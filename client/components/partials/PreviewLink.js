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
  }
  render() {
    return (
      <a href={this.data.slug} className='link link--hidden preview-link'>View more</a>
    )
  }
  update() {
    this.data.slug = '/project/' + Store.Previews[Store.CurrentPreviewIndex].slug
    this.forceUpdate()
  }
  showLink() {
    if (dom.classes.contains(dom.select('.preview-link'), 'link--hidden')) dom.classes.remove(dom.select('.preview-link'), 'link--hidden')
  }
  hideLink() {
    if (!dom.classes.contains(dom.select('.preview-link'), 'link--hidden')) dom.classes.add(dom.select('.preview-link'), 'link--hidden')
  }
}

export default PreviewLink
