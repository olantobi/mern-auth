import { GET_ERRORS } from "./types";

const initialState = {};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_ERRORS:
      return action.paylod; 
      default: 
      return state
  }
}