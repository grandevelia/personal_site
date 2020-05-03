export const fetchBlogs = () => {
	return (dispatch, getState) => {
		let headers = {
			"Content-Type": "application/json"
		};
		let { token } = getState().auth;
		if (token) {
			headers["authorization"] = "Token " + token;
		}
		return fetch("/api/blogs/", { headers, })
			.then(res => {
				if (res.status < 500) {
					return res.json().then(data => {
						return { status: res.status, data };
					})
				} else {
					console.log("Server Error.");
					throw res;
				}
			})
			.then(res => {
				if (res.status === 200) {
					return dispatch({
						type: 'FETCH_BLOGS',
						blogs: res.data
					});
				} else if (res.status === 401 || res.status === 403) {
					dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
					throw res.data;
				}
			})
	}
}