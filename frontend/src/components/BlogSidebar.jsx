import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class BlogSidebar extends Component {
	render(){
		let myBlogs = this.props.blogs;
		return(
			<div className='sidebar'>
				{myBlogs.map((blog)=>{
					let active = "";
					if (blog.id === this.props.active){
						active = " active";
					}

					return (
						<Link 
							to={"/Blog/" + blog.title.replace(/ /g, "-")} 
							className={"sidebar-link " + active} 
							key={"sidebar-" + blog.id}
						>
							{blog.title}
						</Link>
					)
				})}
			</div>
		)
	}
}