import axios from 'axios';

const API_BASE_URL = 'https://api.srtutorsbureau.com/api/v1/teacher';

export const fetchTeacherData = async (userId, token) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/Get-Teacher/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch teacher data');
  }
};

export const fetchTeacherClasses = async (token) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/Get-My-Classes`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data.data.classes;
  } catch (error) {
    throw new Error('Failed to fetch classes');
  }
};

export const uploadProfilePicture = async (teacherId, imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/teacher-profile-pic/${teacherId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload profile picture');
  }
};