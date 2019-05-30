import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import MainTitle from '../../components/partials/MainTitle'
import dom from 'dom-hand'

export default class About extends BaseComponent {
  constructor(props) {
    super(props)
    this.onOverviewOpen = this.onOverviewOpen.bind(this)
    this.toggleOverlay = this.toggleOverlay.bind(this)
    this.hideOverlay = this.hideOverlay.bind(this)
    this.toggleAbout = this.toggleAbout.bind(this)
    this.isMobile = Store.Detector.isMobile
    this.pos = 0
    this.hidden = true
    this.listHidden = true
    this.language = Store.getLang()
    const headerHeight = Constants.MOBILE_LINEHEIGHT + 2 * Constants.GLOBAL_MARGIN
    this.visibleHeight = window.innerHeight - (2 * headerHeight)
    Store.on(Constants.TOGGLE_ABOUT, this.toggleOverlay)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.onOverviewOpen)
    Store.on(Constants.ROUTE_CHANGED, this.hideOverlay)
  }
  render() {
    const content = Store.getContent('about')
    const langState = {}
    if (this.language === 'fr') {
      langState.fr = 'active'
      langState.en = ''
    } else {
      langState.en = 'active'
      langState.fr = ''
    }
    return (
      <div id='about-page' ref='page-wrapper' className='page-wrapper'>
        <div className='wrapper' ref='wrapper'>
          <div className='content'>
            <div className="lang" ref="lang">
              <MainTitle ref='langTitleEn' title={'en'} hasMouseEnterLeave={false} onClick={() => { this.changeLangClick('en') }} className={`link top-logo-title lang-button lang-button--en ${langState.en}`}></MainTitle>
              <span className="lang-separator">|</span>
              <MainTitle ref='langTitleFr' title={'fr'} hasMouseEnterLeave={false} onClick={() => { this.changeLangClick('fr') }} className={`link top-logo-title lang-button lang-button--fr ${langState.fr}`}></MainTitle>
            </div>
            <div className='description' ref='description'>
              <p>
                {content.text[0]}<br/>
                {content.text[1]}<br/>
                {content.text[2]}
              </p>
            </div>
            <p className='catchline' ref='catchline'>{content.text[3]}</p>
            <div className='details' ref='details'>
              <p><a className='link btn' href='https://www.google.fr/maps/place/14+Rue+Coquillière,+75001+Paris' target='_blank'>7 boulevard Saint-Martin 75003 Paris - France</a></p>
              <p>+ 33 (0) 1 53 69 63 83 | <a className='link btn mail' href='mailto:hello@volontiers.fr' ref='mail'>hello@volontiers.fr</a></p>
            </div>
          </div>
          <div className='credits' ref='credits'>
            <MainTitle ref='creditsBtn' title={'Credits'} hasMouseEnterLeave={false}className='link credits__btn'></MainTitle>
            <p className='credits__list' ref='list'><a className='link btn' href='https://www.mmparis.com/' target='_blank'>M/M Paris</a>, <a className='link btn' href='http://convoy.me' target='_blank'>Convoy</a>, <a className='link btn' href='http://www.vabestudio.com/' target='_blank'>Bertrand Vallé</a>, <a className='link btn' href='http://www.le-studiowhite.com/' target='_blank'>Studio White</a>, <a className='link btn' href='http://www.romainmayoussier.com/' target='_blank'>Romain Mayoussier</a></p>
          </div>
        </div>
        <div className='rs' ref='rs'>
          <p><a className='link btn' href='https://www.facebook.com/volontiersparis/' target='_blank' ref='fb'>Facebook</a> | <a className='link btn' href='https://www.instagram.com/volontiers_paris/' target='_blank' ref='insta'>Instagram</a> | <a className='link btn' href='https://vimeo.com/volontiersparis' target='_blank' ref='vimeo'>Vimeo</a></p>
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.parent = this.refs['page-wrapper']
    this.wrapperHeight = dom.size(this.refs.wrapper)[1]
    this.setupAnimations()
  }
  setupAnimations() {
    this.tlBlink = new TimelineMax({
      repeat: -1
    })
    const lengthBlink = 0.3
    this.tlBlink.to(this.refs.fb, lengthBlink, { color: '#f7a1fa', ease: Sine.easeInOut }, 0)
    this.tlBlink.to(this.refs.fb, lengthBlink, { color: '#000000', ease: Sine.easeInOut }, lengthBlink)
    this.tlBlink.to(this.refs.insta, lengthBlink, { color: '#f7a1fa', ease: Sine.easeInOut }, (2 * lengthBlink) - 0.1)
    this.tlBlink.to(this.refs.insta, lengthBlink, { color: '#000000', ease: Sine.easeInOut }, 3 * lengthBlink )
    this.tlBlink.to(this.refs.vimeo, lengthBlink, { color: '#f7a1fa', ease: Sine.easeInOut }, (4 * lengthBlink) - 0.1 )
    this.tlBlink.to(this.refs.vimeo, lengthBlink, { color: '#000000', ease: Sine.easeInOut }, 5 * lengthBlink )
    this.tlBlink.pause(0)
    this.tlOverlayIn = new TimelineMax({
      paused: true,
      onComplete: () => {
        dom.classes.add(this.parent, 'show')
        this.tlBlink.play(0)
      }
    })
    this.tlOverlayIn.set(this.parent, { visibility: 'visible' }, 0)
    this.tlOverlayIn.fromTo(this.parent, 0.55, { opacity: 0 }, { opacity: 1, force3D: true, ease: Expo.easeOut }, 0)
    this.tlOverlayIn.fromTo(this.refs.lang, 0.55, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 0.25)
    this.tlOverlayIn.staggerFromTo(this.refs.description.children, 0.7, { opacity: 0 }, { opacity: 1, ease: Sine.easeInOut }, 0.2, 0.5)
    this.tlOverlayIn.fromTo(this.refs.catchline, 0.55, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 1)
    this.tlOverlayIn.fromTo(this.refs.details, 0.55, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 1.2)
    this.tlOverlayIn.addCallback(this.refs.creditsBtn.show, 1.4)
    this.tlOverlayIn.fromTo(this.refs.list, 0.55, { opacity: 0 }, { opacity: 1, ease: Sine.easeInOut }, 1.4)
    this.tlOverlayIn.fromTo(this.refs.rs, 0.55, { opacity: 0, y: 5 }, { opacity: 1, y: 0, ease: Sine.easeInOut }, 1.4)

    this.tlOverlayOut = new TimelineMax({
      paused: true,
      onComplete: () => {
        dom.classes.remove(this.parent, 'show')
        this.refs.creditsBtn.hide()
        TweenMax.set(this.parent, { visibility: 'hidden' })
      }
    })
    this.tlOverlayOut.fromTo(this.parent, 0.5, { opacity: 1 }, { opacity: 0, force3D: true, ease: Expo.easeOut }, 0)
  }
  changeLangClick(lang) {
    if (lang === this.language) return
    setTimeout(() => { Actions.changeLang() })
  }
  toggleAbout(e) {
    if (dom.classes.has(e.target, 'link') || dom.classes.has(e.target, 'title')) return
    setTimeout(() => { Actions.toggleAbout() })
  }
  toggleOverlay() {
    if (this.hidden) {
      this.hidden = false
      this.tlOverlayIn.play(0)
      this.refs.wrapper.scrollTop = 0
    } else {
      this.hidden = true
      this.tlOverlayOut.play(0)
    }
  }
  hideOverlay() {
    this.hidden = true
    this.listHidden = true
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
