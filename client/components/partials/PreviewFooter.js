import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

class PreviewFooter extends BaseComponent {
  constructor(props) {
    super(props)
    this.data = {
      curentPage: 1,
      totalPages: Object.keys(Data.projects).length,
      title: Store.Previews[0].title,
      slug: '/project/' + Store.Previews[0].slug
    }
  }
  render() {
    return (
      <footer className='footer'>
        <span className='footer__pagination'>{this.data.curentPage}/{this.data.totalPages}</span>
        <h2 className='footer__title'>{this.data.title}</h2>
        <a href={this.data.slug} className='footer__link link'>Discover Project</a>
      </footer>
    )
  }
  componentDidMount() {
    this.update = this.update.bind(this)
    Store.on(Constants.PREVIEW_CHANGED, this.update)
    TweenMax.fromTo(dom.select('.footer'), 0.3, {y: 80, opacity: 0}, {y: 0, opacity: 1, ease: Sine.easeIn})
  }
  update() {
    this.data.title = Store.Previews[Store.CurrentPreviewIndex].title
    this.data.slug = '/project/' + Store.Previews[Store.CurrentPreviewIndex].slug
    this.data.curentPage = Store.CurrentPreviewIndex + 1
    let tl = new TimelineMax()
    tl.to(dom.select('.footer__title'), 0.2, {opacity: 0, ease: Sine.easeIn})
    tl.to(dom.select('.footer__title'), 0.2, {opacity: 1, ease: Sine.easeIn}, '+=0.1')
    setTimeout(() => {
      this.forceUpdate()
    }, 300)
  }
}

export default PreviewFooter
