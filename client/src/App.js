import React from 'reactn'

export default class App extends React.PureComponent {
  componentDidMount() {
    this.setGlobal(
      fetch('/api/nav_points?countries[]=pl&kinds[]=vfr_point')
        .then(response => response.json())
        .then(points => ({ point: points[0] }))
        .catch(err => ({ error: err }))
    )
    // this.setGlobal({point: 'Kasia'})
  }

  render() {
    console.log('render', this.global)
    return (
      <>
        <div id="point">{this.global.point.name}</div>
        <div>{this.global.error}</div>
      </>
    )
  }
}
