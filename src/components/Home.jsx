import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/home.css';
import { models } from "../actions";

class Home extends Component {
	constructor(props) {
		super(props);
		this.video = React.createRef();
		this.photo = React.createRef();
		this.canvas = React.createRef();

		this.state = {
			streaming: false,
			width: 320,
			height: 0,
			photoData: null,
			stream: null
		}
	}
	async getMedia(constraints) {
		let stream = null;
		try {
			stream = await navigator.mediaDevices.getUserMedia(constraints);
			this.setState({
				stream: stream
			}, () => {
				try {
					this.video.srcObject = this.state.stream;
					this.video.play();
				} catch (err) {
					this.state.stream.getTracks()[0].stop();
				}
			})

		} catch (err) {
			console.log(err)
			alert("Camera not found")
		}
	}
	handlePlay() {
		if (!this.state.streaming) {
			let height = this.state.height;
			let width = this.state.width;
			height = this.video.videoHeight / (this.video.videoWidth / width);

			// Firefox currently has a bug where the height can't be read from
			// the video, so we will make assumptions if this happens.

			if (isNaN(height)) {
				height = width / (4 / 3);
			}

			this.setState({
				streaming: true,
				width: width,
				height: height
			})

		}
	}
	clearPhoto() {
		let canvas = this.canvas;
		let context = canvas.getContext('2d');
		context.fillStyle = "#AAA";
		context.fillRect(0, 0, canvas.width, canvas.height);

		let data = canvas.toDataURL('image/png');
		this.setState({
			photoData: data
		})
	}
	takePicture() {
		let canvas = this.canvas;
		let context = canvas.getContext('2d');
		if (this.state.width && this.state.height) {
			canvas.width = this.state.width;
			canvas.height = this.state.height;
			context.drawImage(this.video, 0, 0, this.state.width, this.state.height);

			let data = canvas.toDataURL('image/png');
			this.photo.setAttribute('src', data);
			this.state.stream.getTracks()[0].stop();
			this.props.fetchModel(data);
		} else {
			this.clearPhoto();
		}
	}
	render() {
		return (
			<div className='content'>
				<div className='section' id='top-section'>
					<div id='section-wrap' className='grad-background'>
						<div id='section-body'>
							<div id='photo-display-area'>
								<div className="camera">
									<video ref={video => { this.video = video }} id="video" playsinline onCanPlay={() => this.handlePlay()}>
										Video stream not available.
									</video>
								</div>
								<canvas ref={canvas => this.canvas = canvas} id="canvas">
								</canvas>
								<div className="output">
									<img src={this.state.photoData} ref={photo => this.photo = photo} id="photo" alt="" style={
										this.state.photoData === null ? { zIndex: -1 } : { zIndex: 9999, border: "1 px solid red" }
									}>
									</img>
								</div>
							</div>
							<div id='button-wrap'>
								<div className='grad-background' id='start-camera-wrap' onClick={() => this.getMedia({ audio: false, video: { facingMode: 'environment' } })}>
									<div id='start-camera-inner'>Start Camera</div>
								</div>
								<button id="take-photo" onClick={() => this.takePicture()}>Take photo</button>
							</div>
						</div>
					</div>
					<div id='prediction-wrap'>
						{this.props.models.results !== null ? this.props.models.results.map((pred, i) => {
							return (
								<div key={i} className='model-prediction'>
									<div className='model-label'>
										{pred[0]}
									</div>
									<div className='model-prob'>
										{pred[1]}
									</div>
								</div>
							)
						}) : null}
					</div>
				</div>
			</div >
		)
	}
}

const mapStateToProps = state => {
	return {
		models: state.models,
	}
}
const mapDispatchToProps = dispatch => {
	return {
		fetchModel: data => {
			return dispatch(models.fetchModel(data));
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)