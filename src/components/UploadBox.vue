<template>
  <div id="upload-box">
    <input type="file" name="file" ref="file" :disabled="uploading" @change="uploadFile"
           accept=".csv" class="d-none">
    <button class="import-btn ml-auto" @click="openUploadDialog">Import</button>
    <div class="lds-ring" v-if="uploading">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#upload-box {
  .lds-ring {
    position: absolute;
    width: 40px;
    height: 40px;
    left: 0;

    div {
      width: 30px;
      height: 30px;
      margin: 5px;
      border: 4px solid;
      border-color: #1e91ff transparent transparent transparent;
    }
  }

  .import-btn {
    border: none;
    background-color: #e1efff;
    border-radius: 50px;
    color: #1e91ff;
    cursor: pointer;
    font-size: 14px;
    text-transform: uppercase;
    padding: 10px 40px;
    transition: all 200ms ease-out;
    width: 100%;
    height: 100%;

    &:hover {
      background-color: darken(#e1efff, 25);
      color: #fff;
    }

    &:focus {
      outline: none;
    }
  }
}
</style>

<script>
import UploadService from "@/services/UploadService";

export default {
  data() {
    return {
      uploading: false,
      uploadError: ""
    };
  },

  methods: {
    openUploadDialog() {
      this.$refs.file.click();
    },

    uploadFile(event) {
      const fieldName = event.target.name;
      const fileList = event.target.files;

      if (!fileList.length) return;

      const formData = new FormData();

      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });

      this.save(formData);
    },

    async save(formData) {
      this.uploading = true;
      this.uploadError = "";

      try {
        const orders = await UploadService.uploadCSV(formData);

        this.$store.commit("csvUploaded", orders);

        this.uploading = false;
      } catch (err) {
        if (err.response.data.errors)
          this.uploadError = err.response.data.errors.global;
        else this.uploadError = "An error has occurred!";
      }

      this.uploading = false;
    }
  }
};
//const STATUS_INITIAL = 0,
//  STATUS_SAVING = 1,
//  STATUS_SUCCESS = 2,
//  STATUS_FAILED = 3;
//
//export default {
//  computed: {
//    currentStatus() {
//      return this.$store.getters.uploadStatus;
//    },
//    isInitial() {
//      return this.currentStatus === STATUS_INITIAL;
//    },
//    isSaving() {
//      return this.currentStatus === STATUS_SAVING;
//    },
//    isSuccess() {
//      return this.currentStatus === STATUS_SUCCESS;
//    },
//    isFailed() {
//      return this.currentStatus === STATUS_FAILED;
//    }
//  },
//  methods: {
//    reset() {
//      this.$store.commit("changeUploadStatus", STATUS_INITIAL);
//    },
//
//    filesChange(name, fileList) {
//      const formData = new FormData();
//
//      if (!fileList.length) return;
//
//      Array.from(Array(fileList.length).keys()).map(key => {
//        formData.append(name, fileList[key], fileList[key].name);
//      });
//
//      this.$store.commit("changeUploadStatus", STATUS_SAVING);
//      this.$store.dispatch("uploadCSV", formData);
//    }
//  },
//  mounted() {
//    this.reset();
//  }
//};
</script>
