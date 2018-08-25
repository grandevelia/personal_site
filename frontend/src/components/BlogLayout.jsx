import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blogs } from "../actions";
import { Link, Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';

import '../css/blog.css';
import BlogSidebar from './BlogSidebar';
import BlogTemplate from "./BlogTemplate";
import BlogAdmin from "./BlogAdmin";

class BlogHome extends Component {
	state = {
		title: "",
		text: "",
		active: "",
	}
	updateTitle(title){
		this.setState({title: title});
	}
	updateText(text){
		this.setState({text:text});
	}
	selectForEdit = (id, title, text) => {
		this.setState({active: id, text: text, title: title});
	}
	submitBlog = (e) => {
		e.preventDefault();
		if (this.state.active === ""){
			this.props.addBlog(this.state.title, this.state.text).then(this.setState({title: "", text: ""}));
		} else {
			this.props.updateBlog(this.state.active, this.state.title, this.state.text);
		}
	}
	componentDidMount(){
		this.props.fetchBlogs();
	}
	render(){
		let myBlogs = this.props.blogs;
		console.log(this.props)
		return(
			<Router>
				<div id='all-blogs-wrap'>
					<BlogSidebar blogs={myBlogs} active={this.state.active}/>
					<div id='blog-area'>
						{this.props.isAuthenticated ? 
							<BlogAdmin 
								submitBlog={(e) => this.submitBlog(e)} 
								selectForEdit={(id, title, text) => this.selectForEdit(id, title, text)}
								updateTitle={(title) => this.updateTitle(title)}
								updateText={(text) => this.updateText(text)}
								title={this.state.title}
								text={this.state.text}
							/> : ""
						}
						<Switch>
							<Route exact path="/Blog/" render={()=> <BlogHome blogs={myBlogs} />} />
							{myBlogs.map(blog => {
								return (
									<Route 
										exact path={"/Blog/" + blog.title.replace(/ /g, "-")} 
										key={blog.id} 
										render={() => {
											return (
												<BlogTemplate 
													blog={blog} 
													delete={(id) => this.props.deleteBlog(this.state.active)}
													selectForEdit={(id, title, text) => this.selectForEdit(id, title, text)}
													isAuthenticated={this.props.isAuthenticated}
												/>
											);
										}}
									/>
								)
							})}
						</Switch>
					</div>
				</div>
			</Router>
		)
	}
}
class BlogHome extends Component {
	render(){
		let myBlogs = this.props.blogs;
		return (
			myBlogs.map((blog, id) => {
				return (
					<div className='blog-snippet' key={`blog_${id}`}>
						<div className='blog-snippet-title'>{blog.title}</div>
						<div className='blog-snippet-text'>{blog.text + "..."}</div>
						<Link 
							to={"/Blog/" + blog.title.replace(/ /g, "-")}
							className='go-to-blog'
						>See Full Post</Link>
					</div>
				)
			})
		);
	}
}

const mapStateToProps = state => {
	return {
		blogs: state.blogs,
		isAuthenticated: state.auth.isAuthenticated
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addBlog: (title, text) => {
			return dispatch(blogs.addBlog(title, text));
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BlogHome))