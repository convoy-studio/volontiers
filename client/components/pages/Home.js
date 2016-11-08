import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import Landing from '../partials/Landing'
import Preview from '../partials/Preview'
import PreviewFooter from '../partials/PreviewFooter'
import PreviewLink from '../partials/PreviewLink'
import NextPreviousBtns from '../partials/NextPreviousBtns'

export default class Home extends Page {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div id='home-page' ref='page-wrapper' className='page-wrapper page-wrapper--fixed'>
        <Preview ref='preview'/>
        <PreviewLink ref='preview-link'/>
        <PreviewFooter/>
      </div>
    )
  }
  componentDidMount() {
    this.previewComponent = this.refs.preview
    super.componentDidMount()
  }
  willTransitionOut() {
    this.refs.preview.transitionOut()
    setTimeout(() => { super.willTransitionOut() }, 700)
  }
  willTransitionIn() {
    this.refs.preview.transitionIn()
    setTimeout(() => { super.willTransitionIn() }, 700)
  }
  didTransitionOutComplete() {
    super.didTransitionOutComplete()
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
    super.componentWillUnmount()
  }
}
