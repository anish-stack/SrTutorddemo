import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    formData: {
        selectedClasses: [],
        teacherGender: '',
        numberOfSessions: '',
        minBudget: '',
        maxBudget: '',
        locality: '',
        startDate: '',
        specificRequirement: '',
        longitude: '',
        latitude: '',
        subjects: [],
    },
    currentStep: 1,
};

const teacherPostSlice = createSlice({
    name: 'teacherPost',
    initialState,
    reducers: {
        updateFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
    },
});

export const { updateFormData, setCurrentStep } = teacherPostSlice.actions;
export default teacherPostSlice.reducer;
