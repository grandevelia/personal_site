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
		let NewComp = compose(sketchComponents);
		let temp = <P5Wrapper 
						sketch={ NewComp } 
						playAnimation={ this.state.playAnimation } 
					/>
		return temp;
	}
	render(){	
		let controls = this.props.sketch.controlBindings;
		let descriptions = this.props.sketch.controlDescriptions;
		return(
			<div className='wrap'>
				<div id='grad'>
					{this.getSketch()}
					<div id='top-info'>
						<div id='top-info-title'>Random Animation</div>
						<div id='top-info-body'>{this.props.sketch.title}</div>
					</div>
				</div>
				<div id='bottom-wrap'>

					<div id='site-info-wrap'>
						<div id='site-info-title'>Welcome to my site!</div>
						<div id='site-info-text'><Link to='/Blog/This'>How does this work?</Link></div>
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