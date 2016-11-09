import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'
import Router from '../../services/router'

class MainTitle extends BaseComponent {
  constructor(props) {
    super(props)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.size = [0, 0]
    this.isVisible = false
    this.state = {
      title: this.props.title,
      eventId: this.props.eventId
    }
  }
  render() {
    let classNames = this.props.className + ' main-btn'
    if (this.props.onClick) classNames +=  ' btn'
    return (
      <div ref='parent' onClick={(e) => { e.preventDefault(); this.props.onClick(this.state.eventId) }} className={classNames}>
        <div ref='holder' className="holder">
          <div ref='title' className="title">{this.state.title}</div>
          <div ref='background' className="background"></div>
          <div ref='line' className="line"></div>
        </div>
      </div>
    )
  }
  componentDidMount() {
    if (this.props.hasMouseEnterLeave) {
      dom.event.on(this.refs.parent, 'mouseenter', this.onMouseEnter)
      dom.event.on(this.refs.parent, 'mouseleave', this.onMouseLeave)
    }
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
    this.refs.line.style.width = this.size[0] + 'px'
    this.refs.line.style.height = 6 + 'px'
    this.refs.line.style.top = this.size[1] + 'px'
  }
  updateState(state) {
    this.setState(state)
  }
  onMouseEnter(e) {
    e.preventDefault()
    dom.classes.add(this.refs.parent, 'hover')
  }
  onMouseLeave(e) {
    e.preventDefault()
    dom.classes.remove(this.refs.parent, 'hover')
  }
  transitionIn() {
  }
  transitionOut() {
  }
  show() {
    if (this.isVisible) return
    dom.classes.add(this.refs.parent, 'show')
    this.isVisible = true
  }
  hide() {
    if (!this.isVisible) return
    dom.classes.remove(this.refs.parent, 'show')
    this.isVisible = false
  }
  componentWillUnmount() {
    if (this.props.hasMouseEnterLeave) {
      dom.event.off(this.refs.parent, 'mouseenter', this.onMouseEnter)
      dom.event.off(this.refs.parent, 'mouseleave', this.onMouseLeave)
    }
  }
}

MainTitle.defaultProps = {
  hasMouseEnterLeave: true
}

export default MainTitle
