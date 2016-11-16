import Page from '../Page'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

export default class About extends Page {
  constructor(props) {
    super(props)
    this.onOverviewOpen = this.onOverviewOpen.bind(this)
    this.onOverviewClose = this.onOverviewClose.bind(this)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, this.onOverviewClose)
  }
  render() {
    const content = Store.getAboutPageContent()
    return (
      <div id='about-page' ref='page-wrapper' className='page-wrapper'>
        <p className="description" dangerouslySetInnerHTML={{__html: content}}></p>
      </div>
    )
  }
  componentDidMount() {
    super.componentDidMount()
    TweenMax.to(dom.select('#canvas-container'), 0.5, {backgroundColor: '#ffffff', delay: 0.2 })
  }
  setupAnimations() {
    const parent = this.refs['page-wrapper']
    this.scaleTl = new TimelineMax()
    this.scaleTl.to(parent, 1, { scale: 0.8, rotation: '4deg', force3D: true, ease: Circ.easeInOut }, 0)
    this.tlIn.from(parent, 1, { opacity: 0, force3D: true, ease: Expo.easeOut }, 0)
    this.tlOut.to(parent, 1, { opacity: 0, force3D: true, ease: Expo.easeOut }, 0)
    this.scaleTl.pause(0)
    super.setupAnimations()
  }
  onOverviewOpen() {
    this.scaleTl.timeScale(1.8).play()
  }
  onOverviewClose() {
    this.scaleTl.timeScale(2).reverse()
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    super.resize()
  }
  componentWillUnmount() {
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, this.onOverviewClose)
    super.componentWillUnmount()
  }
}
