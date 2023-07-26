import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';


/* REDUX WORKFLOW : 
 1) we go to form (components/auth/auth.js) where we fill all the inputs 
 2) Once we will we dispatch the action (now this has to do something with redux (eg. we dispatch signIn
    and give it two things formData and history))
 3) Now we come to the actions (here) where we again make a call to api
 4) And, now our api gets some data from the database and return it 
 5) Then, again we make use of that data and dispatch something
 6) Finally, we go into reducers 
*/

// here we are gonna send the data to the database/backend so that it can signin/signup
// but, first we have to create backend end points to do that 

export const signin = (formData, history) => async (dispatch) => {
    try {
      const { data } = await api.signIn(formData);
  
      dispatch({ type: AUTH, data });
  
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };
  
  export const signup = (formData, history) => async (dispatch) => {
    try {
      const { data } = await api.signUp(formData);
  
      dispatch({ type: AUTH, data });
  
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };