import {http} from "../utils";

class EstimatorService {
    startEvaluation(lecture, essays) {
        let formData = new FormData();
        formData.append('lecture', lecture);
        formData.append('essays', essays);

        return http.post('/upload', formData, {
            headers: {
                    "Content-Type": "multipart/form-data",
            }
        });
    }

    endEvaluation(report) {
        return http.post('/end_check', report)
    }

}

export default new EstimatorService();