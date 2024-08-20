import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    ClassSelected: null,
};

const selectedClassSlice = createSlice({
    name: 'selectedClass',
    initialState,
    reducers: {
        setSelectedClass(state, action) {
            state.ClassSelected = action.payload;
        },
        clearSelectedClass(state) {
            state.ClassSelected = null;
        },
    },
});

export const { setSelectedClass, clearSelectedClass } = selectedClassSlice.actions;
export default selectedClassSlice.reducer;
