import api from "../../../api/axios.api";

export const registerUser = async (data) => {
    const res = api.post("/auth/register", data)
    return res.data;
}
export const loginUser = async (data) => {
    const res = api.post("/auth/login", data)
    return res.data;
}
export const getMe = async () => {
    const res = api.get("/auth/me")
    return res.data;
}
export const logoutUser = async (data) => {
    const res = api.post("/auth/logout", data)
    return res.data;
}
