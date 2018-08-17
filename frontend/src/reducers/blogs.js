const initialState = [

];

export default function blogs(state=initialState, action){
	let blogList = state.slice();

	switch (action.type) {
		case 'ADD_BLOG':
			return [...state, action.blog];
		case 'UPDATE_BLOG':
			let blogToUpdate = blogList.filter((blog, i) => {
				if (blog.id === action.blog.id){
					return i;
				}
			});
			blogList.splice(blogToUpdate, 1, action.blog);
			return blogList;
		case 'DELETE_BLOG':
			blogList = blogList.filter(function(blog){
				return blog.id !== action.blogId
			});
			return blogList;
		case 'FETCH_BLOGS':
			return [...action.blogs];
		default:
			return state;
	}
}