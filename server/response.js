const response = (statusCode, data, message, res) => {
    res.status(statusCode).json({
        payload: {
            status: statusCode,
            datas: data || null, 
        },
        message: message || "",
        pagination: {
            prev: "",
            next: "",
            current: "",
        }
    });
};
export default response;