<template>
  <div class="flex-wrap p-2 sm:ml-64">
    <div
      class="p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"
    >
      <div
        class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
      >
        <div
          class="text-2xl font-bold text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-white"
          id="fullWidthTab"
        >
          <div
            id="stats-tab"
            class="inline-block w-full p-4 rounded-tl-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            날짜 : {{ selected_order_info.createdAt }} 주문 번호 :
            {{ selected_order_info.order_number }} 유저 아이디 :
            {{ selected_order_info.order_id }} 총 가격 :
            {{
              selected_order_info.order_quantity *
              selected_order_info.order_price
            }}
          </div>
        </div>
        <div
          id="fullWidthTabContent"
          class="border-t border-gray-200 dark:border-gray-600"
        >
          <dl
            class="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-3 dark:text-white sm:p-8"
          >
            <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl font-extrabold">품목</dt>
              <dd class="text-xl text-gray-500 dark:text-white">
                {{ selected_order_info.order_item }}
              </dd>
            </div>
            <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl font-extrabold">수량(단위:Box)</dt>
              <dd class="text-xl text-gray-500 dark:text-white">
                {{ selected_order_info.order_quantity }}
              </dd>
            </div>
            <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl font-extrabold">가격</dt>
              <dd class="text-xl text-gray-500 dark:text-white">
                {{ selected_order_info.order_price }}
              </dd>
            </div>
            <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl font-extrabold">상태</dt>
              <dd class="text-xl text-gray-500 dark:text-white">
                {{ selected_order_info.order_status }}
              </dd>
            </div>
            <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl font-extrabold">출고여부</dt>
              <dd class="text-xl text-gray-500 dark:text-white">
                {{ selected_order_info.order_shipped }}
              </dd>
            </div>
            <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl font-extrabold">기타 문의사항</dt>
              <dd class="text-xl text-gray-500 dark:text-white">
                {{ selected_order_info.order_others }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="flex flex-row-2">
        <div
          class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <DatePicker v-model="date" mode="date" />
        </div>
        <div
          class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <div
            id="imagelist"
            class="relative max-h-96 overflow-y-scroll sm:rounded-lg"
          >
            <table
              v-if="order_list.length !== 0"
              class="my-3 w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-2xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="text-center text-white py-3 px-6">
                    목록
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in order_list"
                  :key="order.idx"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    class="py-4 px-6 text-2xl font-bold text-gray-900 text-center whitespace-nowrap dark:text-white"
                  >
                    유저 아이디 : {{ order["order_id"] }} 주문 번호 :
                    {{ order["order_number"] }} 주문 날짜 :
                    {{ order["createdAt"] }}
                    <button
                      v-on:click="viewProduct(order)"
                      class="relative text-2xl inline-flex items-center justify-center overflow-hidden text-2xl font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                    >
                      <span
                        class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
                      >
                        확인
                      </span>
                    </button>
                    <button
                      v-on:click="requestCloseOrder(order)"
                      class="relative text-2xl inline-flex items-center justify-center overflow-hidden text-2xl font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                    >
                      <span
                        class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
                      >
                        주문취소
                      </span>
                    </button>
                    <button
                      @click="showModal = true"
                      class="relative text-2xl inline-flex items-center justify-center overflow-hidden text-2xl font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                    >
                      <span
                        class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
                      >
                        리뷰남기기
                      </span>
                    </button>

                    <!-- use the modal component, pass in the prop -->
                    <ModalTool
                      v-if="showModal"
                      :order_info="order"
                      @close="showModal = false"
                    >
                      <!--
       you can use custom content here to overwrite
       default content
       -->
                    </ModalTool>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalTool from "../Modal/ReviewModal";

export default {
  name: "ProductInfo",
  components: { ModalTool },
  data() {
    return {
      order_list: [],
      selected_order_info: {},
      date: new Date(),
      all_order_list: [],
      showModal: false,
    };
  },
  mounted() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      this.$axios
        .post("/order/api/view", {
          userid: this.$store.getters.getUserId,
          loginUserRole: this.$store.getters.getUserRole,
        })
        .then((res) => {
          res.data.order_list.forEach((element) => {
            element["createdAt"] = this.formatDate(element["createdAt"]);
          });
          this.order_list = res.data.order_list;
          this.all_order_list = res.data.order_list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    viewProduct(orderinfo) {
      this.selected_order_info = orderinfo;
    },
    formatDate(date) {
      var d = new Date(date);
      var month = "" + (d.getMonth() + 1);
      var day = "" + d.getDate();
      var year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
    requestCloseOrder(orderinfo) {
      //주문취소
      this.$axios
        .post("/order/api/decline", {
          orderinfo: orderinfo,
        })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    //vuex 변수의 값이 변함을 감지하는 곳
    date() {
      this.order_list = [];
      this.all_order_list.forEach((element) => {
        if (this.formatDate(element.createdAt) == this.formatDate(this.date)) {
          this.order_list.push(element);
        }
      });
      console.log(this.order_list);
    },
  },
};
</script>

<style scoped></style>
