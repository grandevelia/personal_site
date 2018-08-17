const initialState = {
    errors: null,
    title: "",
    file: "",
    description: "",
    controlBindings: {},
    controlDescriptions: {}
};

export default function sketches(state=initialState, action){
	switch (action.type) {
		case 'FETCH_SKETCH':
            return {...action.data};
        case 'SKETCH_ERROR':
            return{...state, errors:"Could not fetch sketch"}
		default:
			return state;
	}
}