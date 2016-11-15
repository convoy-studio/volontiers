import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

class PreviewFooter extends BaseComponent {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    Store.on(Constants.PREVIEW_CHANGED, this.update)
    this.projects = Store.getHomeProjects()
    this.data = {
      curentPage: 1,
      totalPages: this.projects.length,
      title: this.projects[0].title,
      slug: '/project/' + this.projects[0].slug
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
    TweenMax.fromTo(dom.select('.footer'), 0.3, {y: 80, opacity: 0}, {y: 0, opacity: 1, ease: Sine.easeIn})
  }
  update(item) {
    const index = item.previewIdx
    this.data.title = this.projects[index].title
    this.data.slug = '/project/' + this.projects[index].slug
    this.data.curentPage = index + 1
    const tl = new TimelineMax()
    tl.to(dom.select('.footer__title'), 0.2, {opacity: 0, ease: Sine.easeIn})
    tl.to(dom.select('.footer__title'), 0.2, {opacity: 1, ease: Sine.easeIn}, '+=0.1')
    setTimeout(() => {
      this.forceUpdate()
    }, 300)
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEW_CHANGED, this.update)
  }
}

export default PreviewFooter
