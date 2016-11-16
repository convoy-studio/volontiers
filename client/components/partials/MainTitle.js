import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'
import Router from '../../services/router'
import SVGComponent from './SVGComponent'

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
    const nextArrow = this.props.arrow ? (
      <SVGComponent width="18px" height="11px" viewBox="1357 507 18 11" className="next-arrow">
        <g id="Arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(1357.000000, 507.000000)">
          <polygon id="Path" fill="#000000" points="0.615999976 4.694 17 4.694 17 5.882 0.615999976 5.882"></polygon>
          <polygon id="Path" fill="#000000" points="17.37146 5.43377686 16.822 6.274 15.202 8.884 14.5052993 10.0079257 12.52 10 12.52 8.884 13.726 8.884 16.084 5.32 13.798 1.81 12.52 1.81 12.52 0.694 14.6321411 0.729248047 15.328 1.8192749 16.93 4.384 17.37146 4.97611937"></polygon>
        </g>
      </SVGComponent>) : undefined

    return (
      <div ref='parent' onClick={(e) => { e.preventDefault(); this.props.onClick(this.state.eventId) }} className={classNames}>
        <div ref='holder' className="holder">
          <div ref='title' className="title">{this.state.title}</div>
          <div ref='background' className="background"></div>
          <div ref='line' className="line"></div>
        </div>
        {nextArrow}
      </div>
    )
  }
  componentDidMount() {
    if (this.props.hasMouseEnterLeave) {
      dom.event.on(this.refs.parent, 'mouseenter', this.onMouseEnter)
      dom.event.on(this.refs.parent, 'mouseleave', this.onMouseLeave)
    }
    this.onUpdate()
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
    if (e) e.preventDefault()
    dom.classes.add(this.refs.parent, 'hover')
  }
  onMouseLeave(e) {
    if (e) e.preventDefault()
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
