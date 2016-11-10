import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'

export default class About extends Page {
  constructor(props) {
    super(props)
  }
  render() {
    const content = Store.getAboutPageContent()
    return (
  		<div id='about-page' ref='page-wrapper' className='page-wrapper'>
  			<p className="description" dangerouslySetInnerHTML={{__html: content}}></p>
  		</div>
  	)
  }
  willTransitionOut() {
    dom.classes.remove(this.refs['page-wrapper'], 'show')
    setTimeout(() => { super.willTransitionOut() }, 400)
  }
  didTransitionInComplete() {
    dom.classes.add(this.refs['page-wrapper'], 'show')
    setTimeout(() => { super.didTransitionInComplete() }, 850)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    super.resize()
  }
  componentWillUnmount() {
    super.componentWillUnmount()
  }
}
