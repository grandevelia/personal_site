import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blogs } from "../actions";
import { Link, withRouter } from 'react-router-dom';

import '../css/blog.css';
import BlogSidebar from './BlogSidebar';

class BlogHome extends Component {
	state = {
		title: "",
		text: "",
		active: "",
	}
	updateTitle(title) {
		this.setState({ title: title });
	}
	updateText(text) {
		this.setState({ text: text });
	}
	selectForEdit = (id, title, text) => {
		this.setState({ active: id, text: text, title: title });
	}
	submitBlog = (e) => {
		e.preventDefault();
		if (this.state.active === "") {
			this.props.addBlog(this.state.title, this.state.text).then(this.setState({ title: "", text: "" }));
		} else {
			this.props.updateBlog(this.state.active, this.state.title, this.state.text);
		}
	}
	componentDidMount() {
		this.props.fetchBlogs();
	}
	render() {
		let myBlogs = this.props.blogs;
		return (
			<div id='all-blogs-wrap'>
				<BlogSidebar blogs={myBlogs} active={this.state.active} />
				<div id='blog-area'>
					{
						myBlogs.map((blog, id) => {
							return (
								<div className='blog-snippet' key={`blog_${id}`}>
									<div className='blog-snippet-title'>{blog.title}</div>
									<div className='blog-snippet-text' dangerouslySetInnerHTML={{ __html: blog.text.substring(0, 500) + "..." }} />
									<Link
										to={"/Blog/" + blog.title.replace(/ /g, "-")}
										className='go-to-blog'
									>See Full Post</Link>
								</div>
							)
						})
					}
				</div>
			</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BlogHome))