import { combineReducers } from 'redux';
import snippets from "./snippets";
import auth from "./auth";
import blogs from "./blogs";
import sketches from "./sketches";

const myApp = combineReducers({
	snippets, auth, blogs, sketches,
})

export default myApp