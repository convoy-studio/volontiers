import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

class ProjectFooter extends BaseComponent {
  constructor(props) {
    super(props)
    Store.CurrentProjectSlideIndex = 0
    this.slug = this.props.slug
    this.update = this.update.bind(this)
    Store.on(Constants.PROJECT_SLIDE_CHANGED, this.update)
    this.data = {
      curentPage: 1,
      totalPages: Object.keys(Data.projects).length,
      title: Data.projects[this.slug].name
    }
  }
  render() {
    return (
      <footer className='footer'>
        <span className='footer__pagination'>{this.data.curentPage}/{this.data.totalPages}</span>
        <h2 className='footer__title'>{this.data.title}</h2>
        <a href='#' className='footer__link link'>View Informations</a>
      </footer>
    )
  }
  componentDidMount() {
    TweenMax.fromTo(dom.select('.footer'), 0.3, {y: 80, opacity: 0}, {y: 0, opacity: 1, ease: Sine.easeIn})
  }
  update() {
    this.data.curentPage = Store.CurrentProjectSlideIndex + 1
    this.forceUpdate()
  }
}

export default ProjectFooter
