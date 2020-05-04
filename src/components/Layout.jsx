import React, { Component } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import "../css/Layout.css";
export default class Layout extends Component {
	render(){
		return(
			<div className='content'>
				<style>
					@import url('https://fonts.googleapis.com/css?family=Raleway');
				</style>
				<Navbar></Navbar>
				{ this.props.children }
				<Footer></Footer>
			</div>
		);
	}
}