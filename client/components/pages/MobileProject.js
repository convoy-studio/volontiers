import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'
import Constants from '../../constants'
import Actions from '../../actions'
import Router from '../../services/router'
import MainTitle from '../partials/MainTitle'
import Utils from './../../utils/Utils'

export default class Project extends Page {
  constructor(props) {
    super(props)
    this.content = Store.getContent('project')
    this.device = Store.Detector.isMobile ? Constants.MOBILE : Constants.DESKTOP
    this.projectInfo = undefined
    this.content = Store.getContent('project')
    this.projectContent = Store.getCurrentProject()
  }
  render() {
    const id = Router.getNewRoute().target
    const infoContent = Store.getCurrentAboutContent()
    const next = Store.nextProject()
    const projectTitle = this.projectContent.brand + this.projectContent.separator + this.projectContent.project
    const basePath = `assets/images/${id}/`
    const medias = this.projectContent.assets.map( (media, i) => {
      const ext = Utils.getFileExtension(media)
      let mediaItem
      if ( ext === 'mp4') {
        const src = media.substring(0, media.lastIndexOf('.')) + '-mobile' + media.substring(media.lastIndexOf('.'))
        mediaItem = (
          <video src={ basePath + src } className="project__video" width="100%" height="auto" controls></video>
        )
      } else {
        mediaItem = (
          <img src={basePath + media} alt={`${projectTitle} - ${i}`} className="project__image"/>
        )
      }
      return (
        <div className="project__media" key={ i }>{ mediaItem }</div>
      )
    })
    return (
      <div id='project-page' ref='page-wrapper' className='page-wrapper'>
        <img src={basePath + this.projectContent.preview} alt={projectTitle} className="project__cover" ref="cover"/>
        <div className="project__content">
          <MainTitle ref='projectTitle' title={projectTitle} hasMouseEnterLeave={false} className='link project__title show'></MainTitle>
          <p className="project__infos" ref="projectInfos" dangerouslySetInnerHTML={{__html: infoContent}}></p>
          <div className="project__medias" ref="projectMedias">
            { medias }
          </div>
          <div className="project__footer" ref="projectFooter">
            <MainTitle ref='nextProject' title={this.content.nextProject} hasMouseEnterLeave={false} className='link project__nextProject show'></MainTitle>
            <MainTitle ref='nextProjectTitle' title={next.project} hasMouseEnterLeave={false} className='link project__nextProjectTitle show' onClick={ () => Router.setRoute(`/project/${next.slug}`) }></MainTitle>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount() {
    Store.CurrentSlide.state = Constants.STATE.ACTIVE
    super.componentDidMount()
  }
  setupAnimations() {
    this.tlIn.timeScale(1)
    this.tlIn.fromTo(this.refs['page-wrapper'], 1, { opacity: 0 }, { opacity: 1, ease: Circ.easeIn })
    this.tlOut.to(this.refs['page-wrapper'], 0.5, { opacity: 0, ease: Circ.easeOut })
    super.setupAnimations()
  }
  willTransitionIn() {
    super.willTransitionIn()
  }
  didTransitionInComplete() {
    super.didTransitionInComplete()
  }
  willTransitionOut() {
    super.willTransitionOut()
  }
  didTransitionOutComplete() {
    setTimeout(() => { super.didTransitionOutComplete() }, 300)
  }
  componentWillUnmount() {
    super.componentWillUnmount()
  }
}
