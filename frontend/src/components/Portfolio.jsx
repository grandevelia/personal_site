import React, { Component } from 'react';
//import {Link} from 'react-router-dom';

import PortfolioTemplate from "./PortfolioTemplate";
import '../css/portfolio.css';

export default class Portfolio extends Component {
	constructor(props){
		super(props);
		this.state={
			displayType: props.displayType,
			quickLinks: ""
		};
	}
	sidebarClick(componentName){
		this.props.history.replace("/Portfolio/" + componentName);
		this.setState({
			displayType: componentName
		});

	}
	render(){
		const items = this.props.componentNames.map((componentName)=>{
			return <div className="sidebar-link" key={componentName} onClick={() => this.sidebarClick(componentName)}>{componentName}</div>
		})
		return(
				<div id='portfolio-wrap'>
					<div className='sidebar'>
						{items}
					</div>
					<div id='portfolio-body'>
					{
						this.state.displayType.length ?
							<PortfolioTemplate key={this.state.displayType} snippetType={this.state.displayType} />
						: "Portfolio Home"
					}
					</div>
				</div>
		)
	}
}