import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

class ProjectInfos extends BaseComponent {
  constructor(props) {
    super(props)
    Store.CurrentProjectSlideIndex = 0
    this.slug = this.props.slug
    Store.on(Constants.TOGGLE_PROJECT_INFOS, this.toggleSection)
    this.toggled = false
    this.data = {
      content: Data.projects[this.slug].about[Store.Language]
    }
  }
  render() {
    return (
      <section className='project-infos' onClick={this.hideSection}>
        <p className="project-infos__description" dangerouslySetInnerHTML={{__html: this.data.content}}></p>
      </section>
    )
  }
  hideSection() {
    Actions.toggleProjectInfos()
  }
  toggleSection() {
    console.log('toggle')
    let sign = 1
    if (!this.toggled) sign = -1
    TweenMax.to(dom.select('.project-infos'), 0.4, {
      y: Store.Window.h * sign,
      onComplete: () => {
        this.toggled = !this.toggled
      }
    })
  }
}

export default ProjectInfos
