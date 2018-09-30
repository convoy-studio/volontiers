import React from 'react'
import SVGComponent from './SVGComponent'

export default class Img extends React.Component {
  constructor(props) {
    super(props)
    this.isPlaying = false
    this.state = {
      videoSound: false
    }
  }
  render() {
    return (
      <div ref="parent" className={`vid-player ${this.props.className}`}>
        <video ref="video" src={this.props.src} preload muted loop onClick={this.togglePlay}/>
        <SVGComponent className="vid-player__sound-icon" viewBox="0 0 26 22" onClick={this.onSoundClick}>
          <g id="Group" fillRule="nonzero">
            { this.state.videoSound && <path d="M18,3.975 C19.35,5.625 20.125,7.675 20.125,9.95 C20.125,12.225 19.325,14.325 18,15.975 C17.8,16.225 17.475,16.25 17.25,16.05 L16.35,15.25 C16.15,15.075 16.125,14.75 16.3,14.55 C17.3,13.3 17.9,11.7 17.9,9.975 C17.9,8.25 17.3,6.65 16.3,5.4 C16.125,5.175 16.15,4.875 16.35,4.7 L17.25,3.9 C17.475,3.7 17.825,3.75 18,3.975 Z M20.75,1.425 C22.7,3.75 23.875,6.675 23.875,9.95 C23.875,13.225 22.7,16.2 20.75,18.525 C20.575,18.75 20.225,18.775 20.025,18.575 L19.125,17.75 C18.925,17.575 18.9,17.275 19.075,17.05 C20.675,15.125 21.625,12.65 21.625,9.975 C21.625,7.3 20.675,4.825 19.075,2.9 C18.9,2.7 18.925,2.375 19.125,2.2 L20.025,1.375 C20.225,1.2 20.575,1.2 20.75,1.425 Z" className="sound-shape"></path> }
            { !this.state.videoSound && <path d="M21.74375,10.06875 L23.79375,8.01875 C23.91875,7.89375 23.91875,7.66875 23.79375,7.54375 L22.59375,6.34375 C22.46875,6.21875 22.24375,6.21875 22.11875,6.34375 L20.06875,8.39375 L18.01875,6.34375 C17.89375,6.21875 17.66875,6.21875 17.54375,6.34375 L16.34375,7.54375 C16.21875,7.66875 16.21875,7.89375 16.34375,8.01875 L18.39375,10.06875 L16.34375,12.11875 C16.21875,12.24375 16.21875,12.46875 16.34375,12.59375 L17.54375,13.79375 C17.66875,13.91875 17.89375,13.91875 18.01875,13.79375 L20.06875,11.74375 L22.11875,13.79375 C22.24375,13.91875 22.46875,13.91875 22.59375,13.79375 L23.79375,12.59375 C23.91875,12.46875 23.91875,12.24375 23.79375,12.11875 L21.74375,10.06875 Z" className="sound-shape"></path> }
            <path d="M11.775,0.275 L5.175,5.675 L1.475,6.025 C0.7,6.1 0.125,6.75 0.125,7.5 L0.125,12.5 C0.125,13.275 0.7,13.925 1.475,13.975 L5.175,14.325 L11.775,19.725 C12.325,20.175 13.125,19.775 13.125,19.075 L13.125,0.9 C13.1,0.225 12.3,-0.175 11.775,0.275 Z" className="shape" strokeWidth="2"></path>
          </g>
        </SVGComponent>
      </div>
    )
  }
  componentDidMount() {
  }
  play = () => {
    this.refs.parent.classList.add('is-playing')
    this.refs.video.play()
    this.isPlaying = true
  }
  pause = () => {
    this.refs.parent.classList.remove('is-playing')
    this.refs.video.pause()
    this.isPlaying = false
  }
  togglePlay = () => {
    if (this.isPlaying) this.pause()
    else this.play()
  }
  onSoundClick = () => {
    if (this.refs.video.muted) this.refs.video.muted = false
    else this.refs.video.muted = true

    this.setState({
      videoSound: !this.refs.video.muted
    })
  }
}
