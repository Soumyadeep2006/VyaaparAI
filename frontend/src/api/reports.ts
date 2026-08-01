import api from "./axios";

export const getReports = async () => {
    const res = await api.get("/api/reports/");
    return res.data;
};