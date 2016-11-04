// import {TimelineMax} from 'gsap'

export default class BasePage extends React.Component {
  constructor(props) {
    super(props)
    this.didTransitionInComplete = this.didTransitionInComplete.bind(this)
    this.willTransitionIn = this.willTransitionIn.bind(this)
    this.didTransitionOutComplete = this.didTransitionOutComplete.bind(this)
    this.willTransitionOut = this.willTransitionOut.bind(this)
    this.tlIn = new TimelineMax()
    this.tlOut = new TimelineMax()
  }
  render() {
    super.render()
  }
  componentWillMount() {
  }
  componentDidMount() {
    this.resize()
    this.setupAnimations()
    setTimeout(() => this.props.isReady(this.props.hash), 0)
  }
  setupAnimations() {
    this.tlIn.pause(0)
    this.tlOut.pause(0)
  }
  willTransitionIn() {
    console.log('willTransitionIn')
    this.tlIn.eventCallback('onComplete', this.didTransitionInComplete)
    this.tlIn.timeScale(1.8)
    setTimeout(()=>this.tlIn.play(0), 0)
  }
  willTransitionOut() {
    console.log('willTransitionOut')
    this.tlOut.eventCallback('onComplete', this.didTransitionOutComplete)
    this.tlOut.timeScale(1.8)
    setTimeout(()=>this.tlOut.play(0), 500)
  }
  didTransitionInComplete() {
    console.log('didTransitionInComplete')
    this.tlIn.eventCallback('onComplete', null)
    setTimeout(() => this.props.didTransitionInComplete(), 0)
  }
  didTransitionOutComplete() {
    console.log('didTransitionOutComplete')
    this.tlOut.eventCallback('onComplete', null)
    setTimeout(() => this.props.didTransitionOutComplete(), 0)
  }
  resize() {
  }
  forceUnmount() {
    this.tlIn.pause(0)
    this.tlOut.pause(0)
    this.didTransitionOutComplete()
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.tlIn.clear()
    this.tlOut.clear()
  }
}
