import {http} from "../utils";

class EstimatorService {
    evaluateEssays(lecture, essays) {
        let formData = new FormData();
        formData.append('lecture', lecture);
        formData.append('essays', essays);

        return http.post('/upload', formData, {
            headers: {
                    "Content-Type": "multipart/form-data",
            }
        });
    }
}

export default new EstimatorService();