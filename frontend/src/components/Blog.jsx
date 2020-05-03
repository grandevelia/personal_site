import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blogs } from "../actions";
import { Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';

import '../css/blog.css';
import BlogSidebar from './BlogSidebar';
import BlogTemplate from "./BlogTemplate";

class Blog extends Component {
	state = {
		title: "",
		text: "",
		active: "",
	}
	componentDidMount() {
		this.props.fetchBlogs();
	}
	render() {
		let myBlogs = this.props.blogs;
		return (
			<Router>
				<div id='all-blogs-wrap'>
					<BlogSidebar blogs={myBlogs} active={this.state.active} />
					<div id='blog-area'>
						<Switch>
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

const mapStateToProps = state => {
	return {
		blogs: state.blogs
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchBlogs: () => {
			dispatch(blogs.fetchBlogs());
		},
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Blog))