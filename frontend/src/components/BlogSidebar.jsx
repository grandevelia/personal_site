import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import '../css/blog.css';

export default class BlogSidebar extends Component {
	render(){
		return(
			<div className='sidebar'>
				{this.props.blogs.map((blog)=>{
					let active = "";
					if (blog.id === this.props.active){
						active = " active";
					}
					return <Link to={{pathname: "/Blog/" + blog.title.replace(/ /g, "-"), state: blog}} className={"sidebar-link " + active} key={blog.id}>{blog.title}</Link>
				})}
			</div>
		)
	}
}