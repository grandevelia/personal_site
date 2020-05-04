const initialState = {
    results: null
};

export default function blogs(state = initialState, action) {
    switch (action.type) {
        case 'MODEL_RESULT':
            return { ...state, results: action.results };

        case 'ERROR':
            return { ...state, data: action.data };

        default:
            return state;
    }
}