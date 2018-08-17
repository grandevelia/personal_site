const initialState = [

];

export default function snippets(state=initialState, action){
	let snippetList = state.slice();

	switch (action.type) {
		case 'ADD_SNIPPET':
			return [...state, action.snippet];
		case 'UPDATE_SNIPPET':
			let snippetToUpdate = snippetList[action.index]
			snippetToUpdate.text = action.snippet.text;
			snippetToUpdate.title = action.snippet.title;
			snippetList.splice(action.index, 1, snippetToUpdate);
			return snippetList;
		case 'DELETE_SNIPPET':
			snippetList.splice(action.index, 1);
			return snippetList;
		case 'FETCH_SNIPPETS':
			return [...action.snippets];
		default:
			return state;
	}
}