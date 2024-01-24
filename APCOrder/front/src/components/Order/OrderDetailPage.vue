<template>
  <div class="flex-wrap p-2 sm:ml-64">
    <div
      class="p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"
    >
      <div class="relative sm:rounded-lg">
        <div class="flex flex-col">
          <div class="m-auto">
            <div class="flex flex-row">
              <img
                :src="product_info.product_image.data"
                style="width: 500px; height: 500px"
              />
              <!-- 여기에 상품정보 -->
              <div class="mx-20">
                <div
                  class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  style="width: 700px; height: 500px"
                >
                  <h5
                    class="mb-2 text-8xl font-bold tracking-tight text-gray-900 dark:text-white"
                  >
                    {{ product_info.product_item }}
                  </h5>
                  <p
                    class="mb-3 font-normal text-xl text-gray-700 dark:text-gray-400"
                  >
                    상세 설명 : {{ product_info.product_detail }}
                  </p>
                  <p
                    class="mb-3 font-normal text-xl text-gray-700 dark:text-gray-400"
                  >
                    가격 : {{ product_info.product_price }}
                  </p>
                  <label
                    for="default-order"
                    class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >주문 개수</label
                  >
                  <div class="relative py-6">
                    <input
                      type="input"
                      id="default-order"
                      class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="주문 개수"
                      v-model="order.order_quantity"
                      required
                    />
                  </div>

                  <div class="py-6">
                    <div
                      class="border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <label for="comment" class="sr-only">Your comment</label>
                      <textarea
                        id="comment"
                        rows="4"
                        class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                        placeholder="추가 사항을 적어주세요..."
                        v-model="order.order_others"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <button
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    @click="Order"
                  >
                    주문
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 여기에 리뷰정보 -->

          <div class="py-20">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table
                class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">제목</th>
                    <th scope="col" class="px-6 py-3">구매품목</th>
                    <th scope="col" class="px-6 py-3">개수</th>
                    <th scope="col" class="px-6 py-3">주문 날짜</th>
                    <th scope="col" class="px-6 py-3">내용 펼치기</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                    v-for="(review, index) in product_info.review_list"
                    :key="index"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {{ review.review_title }}
                    </th>
                    <td class="px-6 py-4">{{ review.review_item }}</td>
                    <td class="px-6 py-4">{{ review.review_quantity }}</td>
                    <td class="px-6 py-4">{{ review.review_order_date }}</td>
                    <td class="px-6 py-4">
                      <button
                        @click="toggleDropdown(index)"
                        id="dropdownOffsetButton"
                        data-dropdown-toggle="dropdownBottom"
                        data-dropdown-placement="bottom"
                        data-dropdown-offset-distance="35"
                        data-dropdown-offset-skidding="0"
                        type="button"
                      >
                        자세히
                        <div
                          v-if="review.show_content"
                          id="mega-menu-full-image-dropdown"
                        >
                          <div class="font-bold">
                            아이디 : {{ review.review_user_id }}
                          </div>
                          <div class="font-bold">
                            내용 : {{ review.review_content }}
                          </div>
                        </div>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- 리뷰정보 마지막 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        order_item: "",
        order_quantity: "",
        order_price: 1000,
        order_others: "",
      },
      product_info: { product_image: { data: 0 }, review_list: [] },
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    getProduct() {
      this.$axios
        .post("/product/api/detail/view", {
          product_number: this.$route.params.product_number,
        })
        .then((res) => {
          console.log(res);
          if (res.data.success == true) {
            res.data.product_info.product_image.data = this.arrayBufferToBase64(
              res.data.product_info.product_image.data
            );
            res.data.product_info.review_list.forEach((element) => {
              element.show_content = false;
            });
          }
          this.product_info = res.data.product_info;
        })
        .catch((err) => {
          alert(err);
        });
    },
    Order() {
      this.order.order_item = this.product_info.product_item;
      this.order.order_price = this.product_info.product_price;
      this.order.order_product_number = this.product_info.product_number;

      this.$axios
        .post("/order/api/upload", {
          user_id: this.$store.getters.getUserId,
          order: this.order,
        })
        .then((res) => {
          if (res.data.success == true) {
            alert(res.data.message);
          }
          if (res.data.success == false) {
            alert(res.data.message);
          }
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
    toggleDropdown(index) {
      this.product_info.review_list[index].show_content =
        !this.product_info.review_list[index].show_content;
    },
  },
};
</script>

<style></style>
