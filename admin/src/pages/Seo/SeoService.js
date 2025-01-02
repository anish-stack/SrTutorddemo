import axios from 'axios';

export const fetchPageData = async (url) => {
  try {
    const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/seo/get-page/${url}`);
    console.log(response?.data)
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch page data');
  }
};

export const updatePage = async (id, formData) => {
  try {
    const response = await axios.put(
      `https://api.srtutorsbureau.com/api/v1/seo/seo-update-page/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to update page');
  }
};