import React, { Component } from 'react';

export default class BlogAdmin extends Component{
	render(){
		return(
			<form id='admin-area' onSubmit={this.props.submitBlog}>
                <input 
                    value={this.props.title}
                    id='input-title'
                    placeholder="Blog Title..."
                    onChange={(e) => this.props.updateTitle(e.target.value)}
                    required 
                />
                <textarea
                    value={this.props.text}
                    id='input-body'
                    placeholder="Blog text..."
                    onChange={(e) => this.props.updateText(e.target.value)}
                    required 
                />
                <input id='input-submit' type="submit" value="Save Blog" />
            </form>
		)
	}
}