import React, { Component } from 'react';
import {connect} from 'react-redux';

import {Redirect} from 'react-router-dom';
import {auth} from "../actions";
import '../css/authStyle.css';
import Layout from './Layout';

class Register extends Component {
	state = {
		username: "",
		password: "",
	}
	onSubmit = e => {
		e.preventDefault();
		this.props.register(this.state.username, this.state.password, this.state.email);
	}
	render(){
		if (this.props.isAuthenticated){
			return <Redirect to="/" />
		}
		return (
			<Layout>
				<form className='box-form' onSubmit={this.onSubmit}>
					{this.props.errors.length > 0 && (
						<div className='feedback'>
							{this.props.errors.map(error => (
								<div className='invalid' key={error.field}>{error.message}</div>
							))}
						</div>
					)}
					<legend>Sign Up</legend>
					<input
						type='text' id='username' placeholder='Username'
						onChange={e=> this.setState({username:e.target.value})}
					/>
		            <input
		              type="password" id="password" placeholder='Password'
		              onChange={e => {
		              	this.setState({password: e.target.value})
		              }} />
		            <button className='form-submit' type="submit">Register</button>
				</form>
			</Layout>
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
		isAuthenticated: state.auth.isAuthenticated,
	};
}

const mapDispatchToProps = dispatch => {
	return {
		register: (username, password) => {
			return dispatch(auth.register(username, password));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)

