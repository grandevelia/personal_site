import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blogs } from "../actions";
import { Link } from 'react-router-dom';

import '../css/blog.css';
import BlogSidebar from './BlogSidebar';
import BlogTemplate from "./BlogTemplate";

class Blog extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: "",
			text: "",
			active: props.blog || "",
		}
	}

	resetForm = () => {
		this.setState({text: "", title: "", active: ""});
	}
	selectForEdit = () => {
		this.setState({text: this.state.active.text, title: this.state.active.title});
	}
	submitBlog = (e) => {
		e.preventDefault();
		if (this.state.active === ""){
			this.props.addBlog(this.state.text, this.state.title).then(this.resetForm);
		} else {
			this.props.updateBlog(this.state.active.id, this.state.title, this.state.text).then(()=>{
				let curr = this.state.active;
				curr.title = this.state.title;
				curr.text = this.state.text;
				this.setState({active:curr});
			}).then(this.resetForm);
		}
	}
	componentWillReceiveProps(nextProps){
		if(typeof nextProps.location.state !== "undefined"){
			this.setState({
				active: nextProps.location.state
			})
		} else {
			this.setState({
				active: ""
			});
		}
	}
	componentDidMount(){
		this.props.fetchBlogs();
	}
	render(){
		return(
			<div id='all-blogs-wrap'>
				<BlogSidebar blogs={this.props.blogs} active={this.state.active}/>
				<div id='blog-area'>
				{this.props.isAuthenticated ? 
					<form id='admin-area' onSubmit={this.submitBlog}>
						<input 
							value={this.state.title}
							id='input-title'
							placeholder="Blog Title..."
							onChange={(e) => this.setState({title: e.target.value})}
							required />
		  				<textarea
						    value={this.state.text}
						    id='input-body'
						    placeholder="Blog text..."
						    onChange={(e) => this.setState({text: e.target.value})}
						    required />
					  <input id='input-submit' type="submit" value="Save Blog" />
					  <button id='input-reset' onClick={this.resetForm}>Reset</button>
					</form> : ""
				}
				{this.state.active === "" ? 
					this.props.blogs.map((blog, id) => {
					  return (
					  	<div className='blog-snippet' key={`blog_${id}`}>
						  	<div className='blog-snippet-title'>{blog.title}</div>
						    <div className='blog-snippet-text'>{blog.text + "..."}</div>
						    <Link to={{pathname: "/Blog/" + blog.title.replace(/ /g, "-"), state: blog}} className='go-to-blog'>See Full Post</Link>
						  </div>
						)
					}) : <BlogTemplate blog={this.state.active} delete={() => this.props.deleteBlog(this.state.active.id)} edit={() => this.selectForEdit(this.state.active.id)} isAuthenticated={this.props.isAuthenticated}/>
				}
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		blogs: state.blogs,
		user: state.auth.user,
		isAuthenticated: state.auth.isAuthenticated
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addBlog: (text, title) => {
			return dispatch(blogs.addBlog(text, title));
		},
    	updateBlog: (id, title, text) => {
	    	return dispatch(blogs.updateBlog(id, title, text));
	    },
	    deleteBlog: (id) => {
	    	dispatch(blogs.deleteBlog(id));
	    },
	    fetchBlogs: () => {
	    	dispatch(blogs.fetchBlogs());
	    },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)