export const addSnippet = (text, title) => {
	return (dispatch, getState) => {
		let headers = {
			"Content-Type": "application/json"
		};
		let {token} = getState().auth;
    	if(token){
    		headers["authorization"] = "Token " + token;
    	}
		let body = JSON.stringify({text,title});
		return fetch("/api/snippets/", {headers, method: "POST", body})
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
        			type: 'ADD_SNIPPET',
        			snippet: res.data
        		});
    		} else if (res.status === 401 || res.status === 403){
    			dispatch({type: "AUTHENTICATION_ERROR", data:res.data});
    			throw res.data;
    		}
  		})
	}
}

export const updateSnippet = (index, text, title) => {
	return (dispatch, getState) => {
		let headers = {
			"Content-Type": "application/json"
		};
		let {token} = getState().auth;
    	if(token){
    		headers["authorization"] = "Token " + token;
    	}
		let body = JSON.stringify({text,title});
		let snippetId = getState().snippets[index].id;
		let url = "/api/snippets/"+snippetId+"/";
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
			console.log(res);
			if (res.status === 200){
				return dispatch({
					type: 'UPDATE_SNIPPET',
					snippet: res.data,
					index,
				})
			} else if (res.status === 401 || res.status === 403){
    			dispatch({type: "AUTHENTICATION_ERROR", data:res.data});
    			throw res.data;
    		}
		})
	}
}

export const deleteSnippet = index => {
	return (dispatch, getState) => {
		let headers ={"Content-Type": "application/json"}
		let {token} = getState().auth;
    	if(token){
    		headers["authorization"] = "Token " + token;
    	}
		let snippetId = getState().snippets[index].id;

		return fetch("/api/snippets/" + snippetId + "/", {headers, method: "DELETE"})
		.then(res => {
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
					type: "DELETE_SNIPPET",
					index
				})
			} else if (res.status === 401 || res.status === 403){
    			dispatch({type: "AUTHENTICATION_ERROR", data:res.data});
    			throw res.data;
    		}
		})
	}
}

export const fetchSnippets = (tags) => {
	return (dispatch, getState) => {
		let headers = {
			"Content-Type": "application/json"
    	};
    	let {token} = getState().auth;
    	if(token){
    		headers["authorization"] = "Token " + token;
    	}

    	return fetch("/api/snippets/", {headers, })
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
        			type: 'FETCH_SNIPPETS',
        			snippets: res.data
        		});
    		} else if (res.status === 401 || res.status === 403){
    			dispatch({type: "AUTHENTICATION_ERROR", data:res.data});
    			throw res.data;
    		}
  		})
	}
}
