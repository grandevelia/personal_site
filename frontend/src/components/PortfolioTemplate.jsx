import React, { Component } from 'react';
import {connect} from 'react-redux';
import {snippets} from "../actions";

class PortfolioTemplate extends Component{
	state = {
		text: "",
		title: "",
		updateSnippetId: null,
	}
	resetForm = () => {
		this.setState({text: "", title: "", updateSnippetId: null});
	}
	selectForEdit = (id) => {
		let snippet = this.props.snippets[id];
		this.setState({text: snippet.text, title: snippet.title, updateSnippetId: id});
	}
	submitSnippet = (e) => {
		e.preventDefault();
		if (this.state.updateSnippetId === null){
			this.props.addSnippet(this.state.text, this.state.title).then(this.resetForm);
		} else {
			this.props.updateSnippet(this.state.updateSnippetId, this.state.text, this.state.title).then(this.resetForm);
		}
	}
	componentDidMount() {
		this.props.fetchSnippets(this.props.snippetType);
	}
	render(){
		return(
			<div id='snippets-wrap'>
				<div>{this.props.snippetType + " Snippets"}</div>
				{this.props.isAuthenticated ? 
					<form id='admin-area' onSubmit={this.submitSnippet}>
						<input 
							value={this.state.title}
							id='input-title'
							placeholder="Snippet Title..."
							onChange={(e) => this.setState({title: e.target.value})}
							required />
		  				<textarea
						    value={this.state.text}
						    id='input-body'
						    placeholder="Snippet text..."
						    onChange={(e) => this.setState({text: e.target.value})}
						    required />
					  <input id='input-submit' type="submit" value="Save Snippet" />
					  <button id='input-reset' onClick={this.resetForm}>Reset</button>
					</form> : ""
				}

				{this.props.snippets.map((snippet, id) => (
				  <div className='snippet-wrap' key={`snippet_${id}`}>
				  	<div className='snippet-title'>{snippet.title}</div>
				    <div className='snippet-text'>{snippet.text}</div>
				    {this.props.isAuthenticated ? 
				    	<div>
							<button className='snippet-edit' onClick={() => this.selectForEdit(id)}>edit</button>
				    		<button className='snippet-delete' onClick={() => this.props.deleteSnippet(id)}>delete</button>
				    	</div> : ""
				    }

				  </div>
				))}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		snippets: state.snippets,
		user: state.auth.user,
		isAuthenticated: state.auth.isAuthenticated
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addSnippet: (text, title) => {
			return dispatch(snippets.addSnippet(text, title));
		},
    	updateSnippet: (id, text, title) => {
	    	return dispatch(snippets.updateSnippet(id, text, title));
	    },
	    deleteSnippet: (id) => {
	    	dispatch(snippets.deleteSnippet(id));
	    },
	    fetchSnippets: (tags) => {
	    	dispatch(snippets.fetchSnippets(tags));
	    },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioTemplate)