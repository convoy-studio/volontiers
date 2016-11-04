import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'
import Router from '../../services/router'

class MainBtn extends BaseComponent {
  constructor(props) {
    super(props)
    this.size = [0, 0]
    this.state = {
      title: this.props.title,
      eventId: this.props.eventId
    }
  }
  render() {
    const classNames = this.props.className + ' main-btn btn'
    return (
      <div ref='parent' onClick={(e) => { e.preventDefault(); this.props.onClick(this.state.eventId) }} className={classNames}>
        <div ref='holder' className="holder">
          <div ref='title' className="title">{this.state.title}</div>
          <div ref='background' className="background"></div>
        </div>
      </div>
    )
  }
  componentDidMount() {
    setTimeout(() => {
      this.onUpdate()
    }, 10)
  }
  componentDidUpdate() {
    this.onUpdate()
  }
  onUpdate() {
    const rotation = this.props.rotation || '0deg'
    TweenMax.set(this.refs.parent, { rotation: rotation, transformOrigin: '0% 0%' })
    const titleSize = dom.size(this.refs.title)
    const padding = 0
    this.size[0] = titleSize[0] + padding
    this.size[1] = titleSize[1] + padding
    if (rotation !== '0deg') {
      const w = this.size[0]
      this.size[0] = this.size[1]
      this.size[1] = w
    }
    this.refs.parent.style.width = this.size[0] + 'px'
    this.refs.parent.style.height = this.size[1] + 'px'
  }
  updateState(state) {
    this.setState(state)
  }
  show() {
    dom.classes.add(this.refs.parent, 'show')
  }
  hide() {
    dom.classes.remove(this.refs.parent, 'show')
  }
}

export default MainBtn
