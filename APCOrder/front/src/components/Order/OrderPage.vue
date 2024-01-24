<template>
  <div class="flex-wrap p-2 sm:ml-64">
    <div
      class="p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"
    >
      <div v-if="product_list.length !== 0" class="grid grid-cols-4 gap-4 mb-4">
        <div
          v-for="product in product_list"
          :key="product.idx"
          class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
          <img :src="product.product_image.data" class="h-32 mr-6" />
          <a :href="`/order/${product.product_number}`">
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {{ product.product_item }}
            </h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {{ product.product_detail }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      product_list: [],
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    getProduct() {
      this.$axios
        .get("/product/api/view", {})
        .then((res) => {
          if (res.data.success == true) {
            res.data.product_list.forEach((element) => {
              element.product_image.data = this.arrayBufferToBase64(
                element.product_image.data
              );
            });
          }
          this.product_list = res.data.product_list;
        })
        .catch((err) => {
          alert(err);
        });
    },
    arrayBufferToBase64(buffer) {
      var mime;
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      if (len < 4) return null;
      var b0 = bytes[0];
      var b1 = bytes[1];
      var b2 = bytes[2];
      var b3 = bytes[3];
      if (b0 == 0x89 && b1 == 0x50 && b2 == 0x4e && b3 == 0x47)
        mime = "image/png";
      else if (b0 == 0xff && b1 == 0xd8) mime = "image/jpeg";
      else if (b0 == 0x47 && b1 == 0x49 && b2 == 0x46) mime = "image/gif";
      else return null;
      var binary = "";
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      var base64 = window.btoa(binary);
      return "data:" + mime + ";base64," + base64;
    },
  },
};
</script>

<style></style>
