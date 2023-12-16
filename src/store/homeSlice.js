import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
  name: "home",

  initialState: {
    url: {},
    genres: {},                                     // movie type : like comedy, action etc...
  },

  reducers: {
    getApiConfiguration: (state, action) => {       // action creators --> jo action ko create krte hain... action creators ka kaam hota hai user dwara liye gaye action ko state me update karna....
      state.url = action.payload;                   // Redux mein actions ke andar payloads hote hain jo user dwara liye gaye action ki details dete hain jisse wo details application se Redux store mein aata hai. user ke dwara liya action tab Redux store tak pahuchta hai jab use dispatch ke through bheja ja ra ho... iske liye useDispatch() hook kaam me liya jata hai .
    },
    
    getGenres: (state, action) => {                 // action creators --> jo action ko create krte hain..
      state.genres = action.payload;
    },
  },
});

export const { getApiConfiguration, getGenres } = homeSlice.actions;        // yaha per wo 2 action creators export ho rahe hain jo reducers ke andar defined hain... homeSlice.actions se direct getApiConfiguratin and getGeneres action creators export ho rahe hain, jo dusre components mein use hote hain action dispatch karne ke liye.
export default homeSlice.reducer;                                           // homeSlice.reducer ko default export kiya gaya hai, jo store mein state ko update karne ke liye use hota hai.