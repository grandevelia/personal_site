import React, { Component } from 'react';

export default class BlogTemplate extends Component{
	render(){
		return(
			<div className='blog-body'>
				<div className='blog-title'>{this.props.blog.title}</div>
				    <div className='blog-text'>{this.props.blog.text}</div>
				    {this.props.isAuthenticated ? 
				    	<div className='blog-button-area'>
							<button className='blog-edit' onClick={this.props.edit}>edit</button>
				    		<button className='blog-delete' onClick={this.props.delete}>delete</button>
				    	</div> : ""
				    }
			</div>
		)
	}
}