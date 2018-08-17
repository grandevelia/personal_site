export const addBlog = text => {
	return (dispatch, getState) => {
		let headers = {
			"Content-Type": "application/json"
		};
		let {token} = getState().auth;
    	if(token){
    		headers["authorization"] = "Token " + token;
    	}
		let body = JSON.stringify({text,});
		return fetch("/api/blogs/", {headers, method: "POST", body})
		.then(res => {
			if (res.status < 500){
				return res.json().then(data => {
					return {status: res.status, data};
				})
			} else {
				console.log("Server Error.");
				throw res;
			}
		})
    	.then(res => {
    		if (res.status === 201){
      			return dispatch({
        			type: 'ADD_BLOG',
        			blog: res.data
        		});
    		} else if (res.status === 401 || res.status === 403){
    			dispatch({type: "AUTHENTICATION_ERROR", data:res.data});
    			throw res.data;
    		}
  		})
	}
}

export const updateBlog = (blogId, title, text) => {
	return (dispatch, getState) => {
		let headers = {
			"Content-Type": "application/json"
		};
		let {token} = getState().auth;
    	if(token){
    		headers["authorization"] = "Token " + token;
    	}
		let body = JSON.stringify({title, text,});
		let url = "/api/blogs/"+blogId+"/";
		return fetch(url, {headers, method: "PUT", body})
		.then(res => {
			if (res.status < 500){
				return res.json().then(data => {
					return {status: res.status, data};
				})
			} else {
				console.log("Server Error.");
				throw res;
			}
		})
		.then(res => {
			if (res.status === 200){
				return dispatch({
					type: 'UPDATE_BLOG',
					blog: res.data,
				})
			} else if (res.status === 401 || res.status === 403){
    			dispatch({type: "AUTHENTICATION_ERROR", data:res.data});
    			throw res.data;
    		}
		})
	}
}

export const deleteBlog = blogId => {
	return (dispatch, getState) => {

		let headers ={"Content-Type": "application/json"}
		let {token} = getState().auth;
    	if(token){
    		headers["authorization"] = "Token " + token;
    	}

		return fetch("/api/blogs/" + blogId + "/", {headers, method: "DELETE"})
		.then(res => {
			console.log(res)
			if (res.status === 204){
				return {status: res.status, data: {}};
			} else if (res.status < 500){
				return res.json().then(data => {
					return {status: res.status, data};
				})
			} else {
				console.log("Server Error.");
				throw res;
			}
		})
		.then(res => {
			if (res.status === 204){
				return dispatch({
					type: "DELETE_BLOG",
					blogId
				})
			} else if (res.status === 401 || res.status === 403){
    			dispatch({type: "AUTHENTICATION_ERROR", data:res.data});
    			throw res.data;
    		}
		})
	}
}

export const fetchBlogs = (from_id, numToFetch) => {
	return (dispatch, getState) => {
		let headers = {
			"Content-Type": "application/json"
    	};
    	let {token} = getState().auth;
    	if(token){
    		headers["authorization"] = "Token " + token;
    	}
		return fetch("/api/blogs/", {headers, })
		.then(res => {
			if (res.status < 500){
				return res.json().then(data => {
					return {status: res.status, data};
				})
			} else {
				console.log("Server Error.");
				throw res;
			}
		})
    	.then(res => {
    		if (res.status === 200){
      			return dispatch({
        			type: 'FETCH_BLOGS',
        			blogs: res.data
        		});
    		} else if (res.status === 401 || res.status === 403){
    			dispatch({type: "AUTHENTICATION_ERROR", data:res.data});
    			throw res.data;
    		}
  		})
	}
}
