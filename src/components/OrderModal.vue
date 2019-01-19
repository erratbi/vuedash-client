<template>
  <modal v-if="showModal" @close="$emit('close')">
    <template slot="header">
      <div class="d-flex w-100">
        <h3>Add tracking code for order #{{ currentOrder.number }}</h3>
        <div class="ml-auto">
          <a @click="$emit('close')" class="close-btn"><i class="fa fa-close"></i></a>
        </div>
      </div>
    </template>
    <div slot="body">
      <div class="container">
        <div class="row">
          <div class="col-3" v-if="currentOrder.poster">
            <img style="width: 100%" :src="currentOrder.poster"/>
          </div>
          <div class="col-3" v-else>
            <div class="poster-holder">
              <span class="no-pic">No picture</span>
            </div>
          </div>
          <div class="col">
            <h3>{{ currentOrder.product.title }}</h3>
            <label for="tracking-code">Tracking code</label>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <input type="text" class="form-control" :class="{'is-valid': currentOrder.trackingSaved }" ref="tracking" v-model="currentOrder.tracking"
                         placeholder="Paste tracking code here..." id="tracking-code" @keyup.enter="saveTrackingCode()">
                </div>
              </div>
              <div class="col-3">
                <button @click="saveTrackingCode()" class="btn btn-info btn-block">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container border-top mt-5 pt-3">
        <div class="row">
          <div class="col">
            <h3>Tracking & package images</h3>
          </div>
          <div class="col d-flex">
            <div class="ml-auto upload-btn-wrap">
              <input type="file" accept="image/*" @change="uploadImages" ref="imagesDialog" name="images" multiple class="d-none">

              <div class="d-flex">
                <div v-if="uploadError" class="upload-error text-danger mr-3">{{ uploadError }}</div>
                <div v-if="uploading" class="lds-ring mr-3">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <button @click="openImageUploadDialog()" :disabled="uploading" class="btn btn-outline-success ml-auto"><i class="fa fa-plus mr-2"></i> Add images</button>
              </div>
            </div>
          </div>
        </div>
        <div class="row upload-wrapper">
          <div class="col-2 upload-item" v-for="(image, i) in currentOrder.images" :key="`image #${i}`">
            <a class="remove-image" @click="deleteImage(currentOrder, image)"><i class="fa fa-close"></i></a>
            <img :src="image" :alt="`Image #${i}`"/>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>


<script>
import Modal from "@/components/Modal";
import OrderService from "@/services/OrderService";
import UploadService from "@/services/UploadService";

export default {
  components: { Modal },

  data() {
    return {
      uploading: false,
      uploadError: ""
    };
  },

  props: {
    showModal: Boolean,
    currentOrder: Object
  },

  updated() {
    if (this.$refs.tracking) this.$refs.tracking.focus();
  },

  watch: {
    currentOrder: function(newVal, oldVal) {
      if (newVal.number !== oldVal.number) {
        this.uploadError = "";
        this.uploading = false;
      }
    }
  },

  methods: {
    openImageUploadDialog() {
      this.$refs.imagesDialog.click();
    },

    uploadImages(event) {
      const fieldName = event.target.name;
      const fileList = event.target.files;
      const { number } = this.currentOrder;

      if (!fileList.length) return;

      const formData = new FormData();

      formData.append("number", number);

      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });

      this.save(formData);
    },

    async deleteImage(order, image) {
      this.currentOrder.images = await OrderService.deleteImage(order, image);
    },

    async save(formData) {
      this.uploading = true;
      this.uploadError = "";

      try {
        this.images = this.currentOrder.images = await UploadService.uploadImages(
          formData
        );

        this.uploading = false;
      } catch (err) {
        if (err.response.data.errors)
          this.uploadError = err.response.data.errors.global;
        else this.uploadError = "Please upload 5 images max";
      }

      this.uploading = false;
    },

    async saveTrackingCode() {
      const resp = await OrderService.updateTracking(this.currentOrder);
      this.currentOrder.tracking = resp.tracking;
      this.currentOrder.trackingSaved = true;
    }
  }
};
</script>


<style lang="scss" scoped>
input,
button {
  &:focus {
    outline: none;
    box-shadow: none;
  }
}

a.close-btn {
  color: #dc3545;
  cursor: pointer;
  font-size: 30px;
}

.poster-holder {
  background-color: #eee;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:before {
    content: "";
    padding-top: 100%;
    float: left;
  }
}

.upload-btn-wrap {
  .upload-error {
    padding: 10px 0 0;
    font-weight: bold;
    font-size: 11px;
    height: 40px;
  }

  .lds-ring {
    width: 40px;
    height: 40px;
    margin-right: 5px;

    div {
      width: 30px;
      height: 30px;
      border-width: 2px;
      border-top-color: #28a745;
    }
  }
}

.upload-wrapper {
  margin-top: 20px;

  .upload-item {
    .remove-image {
      position: absolute;
      top: -18px;
      right: 5px;
      font-size: 26px;
      cursor: pointer;
      color: #dc3545;
    }

    img {
      width: 100%;
      height: 100%;
    }

    &:before {
      content: "";
      padding-top: 100%;
      float: left;
    }
  }
}
</style>
