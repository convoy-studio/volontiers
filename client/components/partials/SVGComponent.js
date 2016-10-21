import BaseComponent from '../../pager/components/BaseComponent'

class SVGComponent extends BaseComponent {
  render() {
    return <svg {...this.props}>{this.props.children}</svg>
  }
}

export default SVGComponent
