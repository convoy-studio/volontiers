import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import Landing from '../partials/Landing'
import Preview from '../partials/Preview'
import PreviewLink from '../partials/PreviewLink'
import NextPreviousBtns from '../partials/NextPreviousBtns'
import MainTitle from '../partials/MainTitle'

export default class Home extends Page {
  constructor(props) {
    super(props)
    this.didPreviewChange = this.didPreviewChange.bind(this)
    this.onDiscoverProjectClick = this.onDiscoverProjectClick.bind(this)
    Store.on(Constants.PREVIEW_CHANGED, this.didPreviewChange)
    this.projects = Store.getHomeProjects()
  }
  render() {
    return (
      <div id='home-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <Preview ref='preview'/>
        <PreviewLink ref='preview-link'/>
        <MainTitle ref='projectTitle' title={''} hasMouseEnterLeave={false} className='link bottom-project-title'></MainTitle>
        <MainTitle ref='projectDiscover' title={'Discover Project'} hasMouseEnterLeave={true} onClick={this.onDiscoverProjectClick} className='link bottom-project-informations'></MainTitle>
        <MainTitle ref='projectCounter' title={`1/${this.projects.length}`} hasMouseEnterLeave={false} className='link bottom-project-counter'></MainTitle>
      </div>
    )
  }
  componentDidMount() {
    this.previewComponent = this.refs.preview
    this.refs.preview.loadFirstSlide(() => {
      super.componentDidMount()
    })
  }
  willTransitionOut() {
    this.refs.projectTitle.hide()
    this.refs.projectDiscover.hide()
    this.refs.projectCounter.hide()
    this.refs.preview.transitionOut()
    setTimeout(() => { super.willTransitionOut() }, 700)
  }
  willTransitionIn() {
    this.refs.preview.transitionIn()
    setTimeout(() => { super.willTransitionIn() }, 300)
  }
  didTransitionInComplete() {
    this.refs.projectTitle.show()
    this.refs.projectDiscover.show()
    this.refs.projectCounter.show()
    super.didTransitionInComplete()
  }
  onDiscoverProjectClick() {
    const project = this.projects[Store.CurrentPreviewIndex]
    const route = `/project/${project.slug}`
    Router.setRoute(route)
  }
  didPreviewChange(item) {
    const project = this.projects[item.previewIdx]
    this.refs.projectTitle.updateState({
      title: project.title
    })
    setTimeout(() => {
      this.refs.projectCounter.updateState({
        title: `${item.previewIdx + 1}/${this.projects.length}`
      })
    })
  }
  update() {
    this.previewComponent.update()
  }
  resize() {
    this.refs.preview.resize()
    this.refs['preview-link'].resize()
    super.resize()
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEW_CHANGED, this.didPreviewChange)
    super.componentWillUnmount()
  }
}
