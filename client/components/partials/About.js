import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

export default class About extends BaseComponent {
  constructor(props) {
    super(props)
    this.onOverviewOpen = this.onOverviewOpen.bind(this)
    this.onOverviewClose = this.onOverviewClose.bind(this)
    this.toggleOverlay = this.toggleOverlay.bind(this)
    this.hideOverlay = this.hideOverlay.bind(this)
    this.hidden = true
    Store.on(Constants.TOGGLE_ABOUT, this.toggleOverlay)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.onOverviewClose)
    Store.on(Constants.ROUTE_CHANGED, this.hideOverlay)
  }
  render() {
    const content = Store.getContent('about')
    return (
      <div id='about-page' ref='page-wrapper' className='page-wrapper' onClick={this.toggleOverlay}>
        <p className="description" dangerouslySetInnerHTML={{__html: content.text}}></p>
      </div>
    )
  }
  componentDidMount() {
    this.parent = this.refs['page-wrapper']
    this.setupAnimations()
  }
  setupAnimations() {
    this.scaleTl = new TimelineMax()
    this.scaleTl.to(this.parent, 1, { scale: 0.8, force3D: true, ease: Circ.easeInOut }, 0)
    this.scaleTl.pause(0)
  }
  toggleOverlay() {
    if (this.hidden) {
      this.hidden = false
      TweenMax.to(dom.select('#canvas-container'), 0.5, {backgroundColor: '#ffffff', delay: 0.2 })
      TweenMax.fromTo(this.parent, 0.55, { opacity: 0 }, { opacity: 1, force3D: true, ease: Expo.easeOut, onComplete: () => {
        dom.classes.add(this.parent, 'show')
      }})
    } else {
      this.hidden = true
      TweenMax.fromTo(this.parent, 0.4, { opacity: 1 }, { opacity: 0, force3D: true, ease: Expo.easeOut, onComplete: () => {
        dom.classes.remove(this.parent, 'show')
      }})
    }
  }
  hideOverlay() {
    this.hidden = true
    TweenMax.set(this.parent, { opacity: 0 })
    if (dom.classes.has(this.parent, 'show')) dom.classes.remove(this.parent, 'show')
  }
  onOverviewOpen() {
    this.scaleTl.timeScale(1.8).play()
  }
  onOverviewClose() {
    this.scaleTl.timeScale(2).reverse()
  }
  componentWillUnmount() {
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, this.onOverviewClose)
    super.componentWillUnmount()
  }
}
