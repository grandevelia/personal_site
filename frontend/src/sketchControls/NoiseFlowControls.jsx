import React, { Component } from 'react';
export default class NoiseFlowControls extends Component {
	renderControl(controlName, controlDesc){
		return <RenderControl
			controlName={controlName}
			controlDesc={controlDesc}
		/>
	}
	render(){
		return(
			<div className='controls-wrapper'>
				{this.renderControl("Mouseover","Drop new particles")}
			</div>
		)
	}
}

function RenderControl(props){
	return(
		<div className='control'>
			<div className='control-name'>{"<" + props.controlName + "> "}</div>
			<div className='control-desc'>{props.controlDesc}</div>
		</div>
	)
}