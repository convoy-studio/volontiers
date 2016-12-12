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
    this.setupAnimations()
  }
  setupAnimations() {
    const parent = this.refs['page-wrapper']
    this.scaleTl = new TimelineMax()
    this.scaleTl.to(parent, 1, { scale: 0.8, force3D: true, ease: Circ.easeInOut }, 0)
    this.scaleTl.pause(0)
    this.tlIn = new TimelineMax({ onComplete: () => {
      dom.classes.add(parent, 'show')
    }})
    this.tlIn.fromTo(parent, 1, { y: -window.innerHeight }, { y: 0, force3D: true, ease: Expo.easeOut }, 0)
    this.tlIn.timeScale(1.8)
    this.tlIn.pause(0)
    this.tlOut = new TimelineMax({ onComplete: () => {
      dom.classes.remove(parent, 'show')
    }})
    this.tlOut.fromTo(parent, 1, { y: 0 }, { y: -window.innerHeight, force3D: true, ease: Expo.easeOut }, 0)
    this.tlOut.timeScale(1.5)
    this.tlOut.pause(0)
  }
  toggleOverlay() {
    if (this.hidden) {
      this.hidden = false
      this.tlIn.play(0)
    } else {
      this.hidden = true
      this.tlOut.play(0)
    }
  }
  hideOverlay() {
    this.hidden = true
    this.tlOut.play(0)
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
