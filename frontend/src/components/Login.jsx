import React, { Component } from 'react';
import {connect} from 'react-redux';

import {Redirect} from 'react-router-dom';
import {auth} from "../actions";

import '../css/authStyle.css';

class Login extends Component {
	state = {
		username: "",
		password: "",
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.login(this.state.username, this.state.password);
	}

	render() {
		if (this.props.isAuthenticated){
			return <Redirect to="/" />
		}
		return (
			<form className='box-form' onSubmit={this.onSubmit}>
				{this.props.errors.length > 0 && (
					<div className='feedback'>
						{this.props.errors.map(error => (
							<div className='invalid' key={error.field}>{error.message}</div>
						))}
					</div>
				)}
				<legend>Login</legend>
				{this.props.errors.length > 0 && (
					<ul>
						{this.props.errors.map(error => (
							<li key={error.field}>{error.message}</li>
						))}
					</ul>
				)}
				<input
					type='text' id='username' placeholder='Username'
					onChange={e=> this.setState({username:e.target.value})}
				/>
	            <input
	              type="password" id="password" placeholder='Password'
	              onChange={e => {
	              	this.setState({password: e.target.value})
	              }} />
	            <button className='form-submit' type="submit">Login</button>
			</form>
		)
	}
}

const mapStateToProps = state => {
	let errors = [];
	if (state.auth.errors) {
		if (state.auth.errors.detail !== 'Authentication credentials were not provided.'){
			errors = Object.keys(state.auth.errors).map(field => {
				return {field, message: state.auth.errors[field]};
			});
		}
	}
	return {
		errors,
		isAuthenticated: state.auth.isAuthenticated
	};
}

const mapDispatchToProps = dispatch => {
	return {
		login: (username, password) => {
			return dispatch(auth.login(username, password));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)






