import axios from "axios";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

// User related services
export const userLogin = async (data) => {
  try {
    const response = await axios.post(`${SERVER_BASE_URL}/loginUser`, data);
    return response;
  } catch (error) {
    console.error("Error in userLogin:", error.response?.data || error.message);
    throw error;
  }
};

export const userSignup = async (data) => {
  try {
    const response = await axios.post(`${SERVER_BASE_URL}/createUser`, data);
    return response;
  } catch (error) {
    console.error(
      "Error in userSignup:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllUsers = async (pageNo = 1, pageSize = 10, search = '') => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${SERVER_BASE_URL}/getAllUsers`, {
      params: {
        pageNo,
        pageSize,
        search
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in getAllUsers:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserDetails = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${SERVER_BASE_URL}/getUserByUserId`, {
      params: {
        userId: id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(
      "Error in getUserDetails:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUserDetails = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${SERVER_BASE_URL}/updateUserByUserId`,
      data,
      {
        params: {
          userId: id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      "Error in updateUserDetails:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${SERVER_BASE_URL}/deleteUserByUserId/`,
      {
        params: {
          userId: id,
        },

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      "Error in deleteUser:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.delete(`${SERVER_BASE_URL}/logoutUser`);
    return response;
  } catch (error) {
    console.error("Error in logout:", error.response?.data || error.message);
    throw error;
  }
};

export const userProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${SERVER_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error in profile", error.response?.data || error?.message);
    throw error;
  }
};

export const addUser = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${SERVER_BASE_URL}/addUser`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};


