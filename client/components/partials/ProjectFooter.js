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
    this.changeInfosText = this.changeInfosText.bind(this)
    Store.on(Constants.PROJECT_SLIDE_CHANGED, this.update)
    Store.on(Constants.TOGGLE_PROJECT_INFOS, this.changeInfosText)
    this.data = {
      curentPage: 1,
      totalPages: Object.keys(Data.projects[this.slug]).length,
      title: Data.projects[this.slug].name,
      infosText: 'View'
    }
  }
  render() {
    return (
      <footer className='footer'>
        <span className='footer__pagination'>{this.data.curentPage}/{this.data.totalPages}</span>
        <h2 className='footer__title'>{this.data.title}</h2>
        <a href='#' className='footer__link link' onClick={this.toggleInfos}>{this.data.infosText} Informations</a>
      </footer>
    )
  }
  toggleInfos(e) {
    e.preventDefault()
    Actions.toggleProjectInfos()
  }
  changeInfosText() {
    if (this.data.infosText === 'View') {
      this.data.infosText = 'Close'
    } else {
      this.data.infosText = 'View'
    }
    this.forceUpdate()
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
