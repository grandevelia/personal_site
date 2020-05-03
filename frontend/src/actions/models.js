import { apiTarget } from '../settings';

export const fetchModel = (imageData) => {
    return (dispatch, getState) => {
        let data = new FormData();
        data.append("image", imageData);

        return fetch(apiTarget + "api/models/dog_class", { method: "POST", body: data })
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
                        type: 'MODEL_RESULT',
                        results: res.data.predictions
                    });
                } else if (res.status === 401 || res.status === 403) {
                    dispatch({ type: "ERROR", data: res.data });
                }
            })
    }
}
