// Add Course 

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

import axios from "axios";

export const addCourse = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${SERVER_BASE_URL}/addCourse`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      });
        console.log(response);
        
      if (response.status === 201) {
        console.log(response);
        return response.data.data;
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  export const getAllCourses = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${SERVER_BASE_URL}/getAllCourses`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(response.status === 200){
            return response.data.data.courseList
        }
    } catch (error) {
        throw error
    }
  }

  export const getCourseByCourseId = async (courseId) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${SERVER_BASE_URL}/getCourseByCourseId?courseId=${courseId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(response.status === 200){
            return response.data.data
        }
    } catch (error) {
        throw error
    }
  }

export const updateCourse = async (courseId, data) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`${SERVER_BASE_URL}/updateCourseByCourseId?courseId=${courseId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(response.status === 200){
            return response.data.data
        }
    } catch (error) {
        throw error
    }
}

export const deleteCourseByCourseId = async (courseId) => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${SERVER_BASE_URL}/deleteCourseByCourseId?courseId=${courseId}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if(response.status === 200){
          return response
        }

      } catch (error) {
        throw error
      }
}

