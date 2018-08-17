export const fetchSketch = () => {
	return (dispatch, getState) => {
        let data = require("../sketches/NoiseFlow.json");
        if (data){
            return dispatch({
                type: 'FETCH_SKETCH',
                data: data
            });
        } else {
            dispatch({type: "SKETCH_ERROR"});
        }
	}
}
