import { combineReducers } from 'redux';
import blogs from "./blogs";
import models from "./models";

const myApp = combineReducers({
	blogs, models
})

export default myApp