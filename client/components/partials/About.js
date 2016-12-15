import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import dom from 'dom-hand'

export default class About extends BaseComponent {
  constructor(props) {
    super(props)
    this.onOverviewOpen = this.onOverviewOpen.bind(this)
    this.toggleOverlay = this.toggleOverlay.bind(this)
    this.hideOverlay = this.hideOverlay.bind(this)
    this.hidden = true
    Store.on(Constants.TOGGLE_ABOUT, this.toggleOverlay)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.on(Constants.ROUTE_CHANGED, this.hideOverlay)
  }
  render() {
    const content = Store.getContent('about')
    return (
      <div id='about-page' ref='page-wrapper' className='page-wrapper' onClick={() => { setTimeout(() => { Actions.toggleAbout() }) }}>
        <div className='wrapper'>
          <div className='description' ref='description'>
            <p dangerouslySetInnerHTML={{__html: content.text[0]}}></p>
            <p dangerouslySetInnerHTML={{__html: content.text[1]}}></p>
            <p dangerouslySetInnerHTML={{__html: content.text[2]}}></p>
          </div>
          <p className='catchline' ref='catchline'>{content.text[3]}</p>
          <div className='details' ref='details'>
            <p><a className='link btn' href='https://www.google.fr/maps/place/14+Rue+Coquillière,+75001+Paris' target='_blank'>14 rue coquillière 75001 Paris - France</a></p>
            <p>+ 33 (0) 1 53 69 63 87 | <a className='link btn' href='mailto:contact@volontiers.fr' ref='mail'>contact@volontiers.fr</a></p>
          </div>
        </div>
        <div className='rs' ref='rs'>
          <p><a className='link btn' href='https://www.google.fr' target='_blank' ref='fb'>Facebook</a> | <a className='link btn' href='https://www.google.fr' target='_blank' ref='insta'>Instagram</a></p>
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.parent = this.refs['page-wrapper']
    this.setupAnimations()
  }
  setupAnimations() {
    this.tlBlink = new TimelineMax()
    const lengthBlink = 0.3
    this.tlBlink.to(this.refs.mail, lengthBlink, { color: '#f7a1fa', ease: Sine.easeInOut }, 0)
    this.tlBlink.to(this.refs.mail, lengthBlink, { color: '#000000', ease: Sine.easeInOut }, lengthBlink)
    this.tlBlink.to(this.refs.fb, lengthBlink, { color: '#f7a1fa', ease: Sine.easeInOut }, (2 * lengthBlink) - 0.1)
    this.tlBlink.to(this.refs.fb, lengthBlink, { color: '#000000', ease: Sine.easeInOut }, 3 * lengthBlink )
    this.tlBlink.to(this.refs.insta, lengthBlink, { color: '#f7a1fa', ease: Sine.easeInOut }, (4 * lengthBlink) - 0.1 )
    this.tlBlink.to(this.refs.insta, lengthBlink, { color: '#000000', ease: Sine.easeInOut }, 5 * lengthBlink )
    this.tlBlink.pause(0)
    this.tlOverlayIn = new TimelineMax({ onComplete: () => {
      dom.classes.add(this.parent, 'show')
      this.tlBlink.play(0)
    }})
    this.tlOverlayIn.set(this.parent, { visibility: 'visible' }, 0)
    this.tlOverlayIn.fromTo(this.parent, 0.55, { opacity: 0 }, { opacity: 1, force3D: true, ease: Expo.easeOut }, 0)
    this.tlOverlayIn.to(dom.select('#canvas-container'), 0.5, {backgroundColor: '#ffffff' }, 0)
    this.tlOverlayIn.staggerFromTo(this.refs.description.children, 0.7, { opacity: 0 }, { opacity: 1, ease: Sine.easeInOut }, 0.2, 0.5)
    this.tlOverlayIn.fromTo(this.refs.catchline, 0.55, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 1)
    this.tlOverlayIn.fromTo(this.refs.details, 0.55, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 1.2)
    this.tlOverlayIn.fromTo(this.refs.rs, 0.55, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 1.4)
    this.tlOverlayIn.pause(0)

    this.tlOverlayOut = new TimelineMax({ onComplete: () => {
      dom.classes.remove(this.parent, 'show')
      TweenMax.set(this.parent, { visibility: 'hidden' })
    }})
    this.tlOverlayOut.fromTo(this.parent, 0.5, { opacity: 1 }, { opacity: 0, force3D: true, ease: Expo.easeOut }, 0)
    this.tlOverlayOut.pause(0)
  }
  toggleOverlay() {
    if (this.hidden) {
      this.hidden = false
      this.tlOverlayIn.play(0)
    } else {
      this.hidden = true
      this.tlOverlayOut.play(0)
    }
  }
  hideOverlay() {
    this.hidden = true
    TweenMax.set(this.parent, { opacity: 0 })
    if (dom.classes.has(this.parent, 'show')) dom.classes.remove(this.parent, 'show')
  }
  onOverviewOpen() {
    this.hidden = false
    this.toggleOverlay()
  }
  componentWillUnmount() {
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, this.onOverviewClose)
    super.componentWillUnmount()
  }
}
