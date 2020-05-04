import React, { Component } from 'react';

export default class BlogTemplate extends Component{
	componentDidMount(){
		let blog = this.props.blog;
		this.props.selectForEdit(blog.id, blog.title, blog.text);
	}
	render(){
		return(
			<div className='blog-body'>
				<div className='blog-title'>{this.props.blog.title}</div>
					<div className='blog-text' dangerouslySetInnerHTML={{ __html:this.props.blog.text}}>
					</div>
				    {this.props.isAuthenticated ? 
				    	<div className='blog-button-area'>
				    		<button className='blog-delete' onClick={this.props.delete}>delete</button>
				    	</div> : ""
				    }
			</div>
		)
	}
}