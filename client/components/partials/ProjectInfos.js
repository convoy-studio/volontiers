import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

class ProjectInfos extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.TOGGLE_PROJECT_INFOS, this.onToggleSection)
    this.toggled = false
  }
  render() {
    const content = Store.getCurrentAboutContent()
    return (
      <section ref='parent' className='project-infos' onClick={this.hideSection}>
        <p className="project-infos__description" dangerouslySetInnerHTML={{__html: content}}></p>
      </section>
    )
  }
  componentDidMount() {
    this.tl = new TimelineMax()
    this.tl.from(this.refs.parent, 1, { y: Store.Window.h * 2, force3D: true, transformOrigin: '50% 0%', ease: Expo.easeInOut }, 0)
    this.tl.pause(0)
  }
  hideSection() {
    Actions.toggleProjectInfos()
  }
  onToggleSection() {
    if (this.toggled) {
      this.tl.reverse().timeScale(2)
      this.toggled = false
    } else {
      this.tl.play().timeScale(1.8)
      this.toggled = true
    }
  }
  componentWillUnmount() {
    this.tl.clear()
    this.tl = null
    Store.off(Constants.TOGGLE_PROJECT_INFOS, this.onToggleSection)
  }
}

export default ProjectInfos
