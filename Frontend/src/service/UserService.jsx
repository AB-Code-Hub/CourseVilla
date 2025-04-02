import axios from "axios"

export const UserLogin = async (data) =>( 
     await axios.post(`${import.meta.env.SERVER_BASE_URL}/loginUser`, data)
)

export const UserSignup = async (data) =>( 
     await axios.post(`${import.meta.env.SERVER_BASE_URL}/createUser`, data)
)

export const getAllUsers = async () =>(
        await axios.get(`${import.meta.env.SERVER_BASE_URL}/getAllUsers`)
    )


export const getUserDetails = async (id) =>(
        await axios.get(`${import.meta.env.SERVER_BASE_URL}/getUserByUserId/${id}`)
    )

export const updateUserDetails = async (id, data) =>(
            await axios.put(`${import.meta.env.SERVER_BASE_URL}/updateUserByUserId/${id}`, data)
      )

export const deleteUser = async (id) =>(
        await axios.delete(`${import.meta.env.SERVER_BASE_URL}/deleteUserByUserId/${id}`)
)