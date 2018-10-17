import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../css/home.css';
import P5Wrapper from './react-p5-wrapper';
import NoiseFlowSketch from '../sketches/FactoryTest';
import Flipper from '../sketches/Flipper';
import { sketches } from '../actions';
import { compose } from '../sketches/SketchComposer.js';

const sketchComponents = [
	NoiseFlowSketch,
	Flipper
]
const titleMap = {
	NoiseFlowSketch: 0,
	Flipper: 1
}
class Home extends Component {
	state = {
		playAnimation: true
	}
	handleClick = e => {
		this.setState({
			playAnimation: !this.state.playAnimation
		});
	}
	componentDidMount(){
		this.props.fetchSketch();
	}
	getSketch(){
		//let key = titleMap[this.props.sketch.file];
		//let Comp = sketchComponents[key];
		//let NewComp = compose(sketchComponents);
		/*let temp = <P5Wrapper 
						sketch={ NewComp } 
						playAnimation={ this.state.playAnimation } 
					/>*/
		//return temp;
		return <div id='sketch'></div>
	}
	render(){	
		console.log(this.props)
		let controls = this.props.sketch.controlBindings;
		let descriptions = this.props.sketch.controlDescriptions;
		return(
			<div className='content'>
				<div className='section-title' id='top-title'>COMPOSER</div>
				<div className='section' id='top-section'>
					<div id='canvas-wrap'>
						<div id='sketch-standin'>
							<div id='canvas-area'>
								<div className='canvas-section' id='canvas-left'>
									<div className='canvas-section-title'>Available Components</div>
								</div>
								{this.getSketch()}
								<div className='canvas-section' id='canvas-right'>
									<div className='canvas-section-title'>In Use</div>
								</div>
							</div>
							<div id='sketch-controls'>

							</div>
						</div>
					</div>
				</div>
				<div id='bottom-wrap'>

					<div id='site-info-wrap'>
						<div id='site-info-title'>Welcome to my site!</div>
						<div id='site-info-text'><Link to='/Blog/P5JS-Composition-in-React'>How does this work?</Link></div>
					</div>
					<div id='animation-controls'>
						<div id='controls-title'>Controls
							<div className='button' 
								onClick={this.handleClick}
								id='toggle-animation'
							>{this.state.playAnimation ? "Pause":"Start"}</div>
						</div>
						{Object.keys(controls).map(binding => {
							return <div key={binding} className='controlBinding'>{controls[binding]}</div>;
						})}
						{Object.keys(descriptions).map(desc => {
							return <div key={desc} className='controlDesc'>{descriptions[desc]}</div>;
						})}
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		sketch: state.sketches
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchSketch: () => {
			return dispatch(sketches.fetchSketch());
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)