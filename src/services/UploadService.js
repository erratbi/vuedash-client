import Api from "@/services/Api";

export default {
  uploadCSV: formData => Api.post("/upload", formData).then(resp => resp.data),
  uploadImages: formData =>
    Api.post("/upload/images", formData).then(resp => resp.data.images)
};
