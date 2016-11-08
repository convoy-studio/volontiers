import React from 'react'

export default class Img extends React.Component {
  render() {
    return (
      <img src={this.props.src}/>
    )
  }
  componentDidMount() {
    const img = new Image()
    img.onload = ()=> {
      if (this.props.didLoad) {
        this.props.didLoad(this.props, {
          width: img.width,
          height: img.height
        })
      }
    }
    img.src = this.props.src
  }
}
