<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="flex items-center flex-col">
          <div
            class="h-[500px] block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-y-scroll"
          >
            <div class="w-[800px]">
              <div class="flex items-center justify-between">
                <div class="flex items-center justify-start">
                  <h5
                    class="mb-2 text-white font-bold rounded-lg text-xl py-4 mr-2"
                  >
                    리뷰 등록
                  </h5>
                </div>
                <div class="flex flex-row-reverse items-center justify-between">
                  <button
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    @click="$emit('close')"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-body">
              <slot name="body">
                <div class="py-6">
                  <div
                    class="border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <label for="default-order" class="sr-only">제목</label>
                    <div class="relative py-6">
                      <input
                        type="input"
                        id="default-order"
                        class="block w-full p-4 text-sm text-gray-900 border border-gray-800 rounded-lg bg-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="제목"
                        v-model="review.review_title"
                        required
                      />
                    </div>
                    <label for="comment" class="sr-only">리뷰</label>
                    <textarea
                      id="comment"
                      rows="4"
                      class="w-full px-0 text-sm text-gray-900 bg-white border-0 rounded-lg dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                      placeholder="리뷰를 남겨주세요..."
                      v-model="review.review_content"
                      required
                    ></textarea>
                  </div>
                </div>
                <button
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  @click="submitReview"
                >
                  등록
                </button></slot
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      review: {
        review_title: "",
        review_item: "",
        review_content: "",
        review_quantity: 0,
        review_user_id: "",
        review_order_date: "",
      },
      product_number: "",
    };
  },
  props: {
    order_info: Object,
  },
  methods: {
    submitReview() {
      this.review.review_item = this.order_info.order_item;
      this.review.review_quantity = this.order_info.order_quantity;
      this.review.review_user_id = this.order_info.order_id;
      this.review.review_order_date = this.order_info.createdAt;
      this.product_number = this.order_info.order_product_number;

      this.$axios
        .post("/product/api/upload/review", {
          product_number: this.product_number,
          review: this.review,
        })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  color: #555555;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
