<template>
  <div class="flex-wrap p-2 sm:ml-64">
    <div class="p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
      <div class="inline-flex flex-row gap-4 mb-2">
        <div class="inline-flex flex-col">
          <div class="flex gap-4 mb-4">
            <iframe id="iframeExample" width="1100" height="605" src="https://e1cc-118-36-223-138.ngrok-free.app/webgl1/"
              frameborder="0" framespacing="0" marginheight="0" marginwidth="0" scrolling="no" vspace="0"></iframe>
          </div>

          <div class="inline-flex">
            <div class="flex flex-row">
              <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-white-700">
                <div class="flex flex-row">
                  <div class="flex">
                    <Line :options="chartZoneTempOptions" :data="chartZoneTempData" width="413" height="215" />
                  </div>
                  <div class="flex">
                    <Line :options="chartZoneHumidOptions" :data="chartZoneHumidData" width="413" height="215" />
                  </div>
                </div>
              </div>
              <div class="inline-flex">
                <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div class="flex flex-row">
                    <div class="inline-flex items-center px-3 py-2">
                      <select id="Zone" v-model="storage_info.zone_number"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="" selected disabled hidden>
                          === Zone ===
                        </option>
                        <option value="none" disabled>=== Zone ===</option>

                        <option v-for="storage_info in all_storage_info" :key="storage_info.idx"
                          :value="storage_info.zone_number">
                          {{ storage_info.zone_number }}
                        </option>
                      </select>
                    </div>
                    <div class="inline-flex items-center px-3 py-2">
                      <button @click="selectStorage"
                        class="relative inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        선택
                      </button>
                    </div>
                  </div>
                  <h5 class="mb-2 px-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    A : {{ select_storage_info.A }}
                  </h5>
                  <h5 class="mb-2 px-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    B : {{ select_storage_info.B }}
                  </h5>
                  <h5 class="mb-2 px-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    C : {{ select_storage_info.C }}
                  </h5>
                  <h5 class="mb-2 px-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    가공 : {{ select_storage_info.가공 }}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="inline-flex">
          <div>
            <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div
                class="text-2xl font-bold text-center text-gray-500 divide-x divide-gray-200 rounded-lg dark:divide-gray-600 dark:text-white"
                id="fullWidthTab">
                <div id="stats-tab"
                  class="p-4 rounded-tl-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600">
                  유저 아이디 : {{ user_id }} 총 무게 : {{ all_weight }} kg
                </div>
              </div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-white-700">
              <div class="flex gap-4 mb-4">
                <Bar :options="chartGradeOptions" :data="chartGradeData" width="500" height="270" />
              </div>
              <div class="flex gap-4 mb-4">
                <Bar :options="chartAppleOptions" :data="chartAppleData" width="500" height="470" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// var unityInstance;

// import UnityWebgl from "unity-webgl";
// import UnityVue from "unity-webgl/vue";

// const unityContext = new UnityWebgl({
//   loaderUrl: "dashboard/Build/GRID_WEB.loader.js",
//   dataUrl: "dashboard/Build/GRID_WEB.data",
//   frameworkUrl: "dashboard/Build/GRID_WEB.framework.js",
//   codeUrl: "dashboard/Build/GRID_WEB.wasm",
// });
</script>

<script>
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale
);

import * as chartAppleConfig from "./ChartData/ChartAppleData.js";
import * as chartGradeConfig from "./ChartData/ChartGradeData.js";
import * as chartZoneTempConfig from "./ChartData/ChartSectorTempData.js";
import * as chartZoneHumidConfig from "./ChartData/ChartSectorHumidData.js";

export default {
  name: "DashBoard",
  components: { Bar, Line },
  data() {
    return {
      showModal: false,
      chartAppleData: chartAppleConfig.randomData(),
      chartAppleOptions: chartAppleConfig.options,
      chartGradeData: chartGradeConfig.randomData(),
      chartGradeOptions: chartGradeConfig.options,
      chartZoneTempData: chartZoneTempConfig.randomData(),
      chartZoneTempOptions: chartZoneTempConfig.options,
      chartZoneHumidData: chartZoneHumidConfig.randomData(),
      chartZoneHumidOptions: chartZoneHumidConfig.options,
      selectedFile: "",
      uploadFile: "",
      user_id: "init_id",
      all_weight: 0,
      storage_info: {
        zone_number: 1,
        sector_number: 1,
      },

      select_storage_info: {},
      all_storage_info: [],
      sector_number: [],
    };
  },
  methods: {
    changeLocalStorage() {
      const contentsArray = this.$store.getters.getAlertData; //index vuex -> 로컬스토리지 적용부분 1
      var contents = []; //index vuex -> 로컬스토리지 적용부분 2
      contentsArray.forEach(function (item) {
        //index vuex -> 로컬스토리지 적용부분 3
        contents.push(item["content"]);
      });
      localStorage.setItem("contents", contents); //index vuex -> 로컬스토리지 적용부분 4
    },
    async Insert(message) {
      await this.$store.commit("insertAlertData", message);
      await this.changeLocalStorage();
    },
    async deleteAppleData(user_id) {
      await this.$axios
        .post("/dashboard/kafka/item/api/delete", {
          user_id: user_id,
        })
        .then((res) => {
          if (res.data.message != "fail") {
            var alarm_message =
              "시각 : " +
              res.data["apple_data"]["date"] +
              " 유저아이디 : " +
              user_id +
              " 총 중량: " +
              res.data["apple_data"]["all_weight"] +
              " kg A : " +
              res.data["grade_data"]["A_grade"] +
              " B : " +
              res.data["grade_data"]["B_grade"] +
              " C : " +
              res.data["grade_data"]["C_grade"] +
              " D : " +
              res.data["grade_data"]["D_grade"] +
              " E : " +
              res.data["grade_data"]["E_grade"];
            //여기에 알림을 띄움
            this.Insert(alarm_message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async checkAppleData() {
      await this.$axios
        .get("/dashboard/kafka/item/api/check", {})
        .then((res) => {
          if (this.user_id != res.data["apple_data"]["user_id"]) {
            this.deleteAppleData(this.user_id);
          }
          this.getAppleData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getAppleData() {
      await this.$axios
        .get("/dashboard/kafka/item/api/view", {})
        .then((res) => {
          this.user_id = res.data["apple_data"]["user_id"];
          this.all_weight = Math.floor(
            res.data["apple_data"]["all_weight"] / 100
          );
          this.chartAppleData = {
            labels: [
              "과중(g / 10)",
              "종경(mm)",
              "횡경(mm)",
              "L/D비율(%)",
              "경도(N/ø11mm)",
              "당도(˚Brix)",
              "산도 * 100(% * 100)",
              "착색(Hunter A)",
            ],
            datasets: [
              {
                label: "평균 데이터",
                data: [
                  res.data["apple_data"]["weight"],
                  res.data["apple_data"]["row"],
                  res.data["apple_data"]["col"],
                  res.data["apple_data"]["ratio"],
                  res.data["apple_data"]["hardness"],
                  res.data["apple_data"]["brix"],
                  res.data["apple_data"]["acidity"],
                  res.data["apple_data"]["color"],
                ],
                backgroundColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(255, 205, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(201, 203, 207, 1)",
                  "rgba(0, 0, 0, 1)",
                ],
                borderColor: [
                  "rgb(255, 99, 132)",
                  "rgb(255, 159, 64)",
                  "rgb(255, 205, 86)",
                  "rgb(75, 192, 192)",
                  "rgb(54, 162, 235)",
                  "rgb(153, 102, 255)",
                  "rgb(201, 203, 207)",
                  "rgb(0, 0, 0)",
                ],
              },
            ],
          };
          this.chartGradeData = {
            labels: ["A", "B", "C", "D", "E"],
            datasets: [
              {
                label: "등급 데이터",
                data: [
                  res.data["grade_data"]["A_grade"],
                  res.data["grade_data"]["B_grade"],
                  res.data["grade_data"]["C_grade"],
                  res.data["grade_data"]["D_grade"],
                  res.data["grade_data"]["E_grade"],
                ],
                backgroundColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(255, 205, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                ],
                borderColor: [
                  "rgb(255, 99, 132)",
                  "rgb(255, 159, 64)",
                  "rgb(255, 205, 86)",
                  "rgb(75, 192, 192)",
                  "rgb(54, 162, 235)",
                ],
              },
            ],
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getZoneData() {
      this.$axios
        .post("/dashboard/kafka/storage/api/view", {
          zone_number: this.storage_info.zone_number,
        })
        .then((res) => {
          this.chartZoneTempData = {
            labels: [
              res.data["temp_data_time"][10].slice(-8),
              res.data["temp_data_time"][9].slice(-8),
              res.data["temp_data_time"][8].slice(-8),
              res.data["temp_data_time"][7].slice(-8),
              res.data["temp_data_time"][6].slice(-8),
              res.data["temp_data_time"][5].slice(-8),
              res.data["temp_data_time"][4].slice(-8),
              res.data["temp_data_time"][3].slice(-8),
              res.data["temp_data_time"][2].slice(-8),
              res.data["temp_data_time"][1].slice(-8),
              res.data["temp_data_time"][0].slice(-8),
            ],
            datasets: [
              {
                label: "최근 1시간 온도(10분 단위)",
                data: [
                  res.data["temp_data"][10],
                  res.data["temp_data"][9],
                  res.data["temp_data"][8],
                  res.data["temp_data"][7],
                  res.data["temp_data"][6],
                  res.data["temp_data"][5],
                  res.data["temp_data"][4],
                  res.data["temp_data"][3],
                  res.data["temp_data"][2],
                  res.data["temp_data"][1],
                  res.data["temp_data"][0],
                ],
                backgroundColor: [
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                ],
                borderColor: [
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                ],
              },
            ],
          };
          this.chartZoneHumidData = {
            labels: [
              res.data["humid_data_time"][10].slice(-8),
              res.data["humid_data_time"][9].slice(-8),
              res.data["humid_data_time"][8].slice(-8),
              res.data["humid_data_time"][7].slice(-8),
              res.data["humid_data_time"][6].slice(-8),
              res.data["humid_data_time"][5].slice(-8),
              res.data["humid_data_time"][4].slice(-8),
              res.data["humid_data_time"][3].slice(-8),
              res.data["humid_data_time"][2].slice(-8),
              res.data["humid_data_time"][1].slice(-8),
              res.data["humid_data_time"][0].slice(-8),
            ],
            datasets: [
              {
                label: "최근 1시간 습도(10분 단위)",
                data: [
                  res.data["humid_data"][10],
                  res.data["humid_data"][9],
                  res.data["humid_data"][8],
                  res.data["humid_data"][7],
                  res.data["humid_data"][6],
                  res.data["humid_data"][5],
                  res.data["humid_data"][4],
                  res.data["humid_data"][3],
                  res.data["humid_data"][2],
                  res.data["humid_data"][1],
                  res.data["humid_data"][0],
                ],
                backgroundColor: [
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                  "rgba(0, 0, 0, 1)",
                ],
                borderColor: [
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                  "rgb(255, 0, 0)",
                ],
              },
            ],
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectStorage() {
      this.$axios
        .post("/dashboard/storage/api/select/view", {
          zone_number: this.storage_info.zone_number,
        })
        .then((res) => {
          if (res.data.success == true) {
            this.select_storage_info = res.data.zone_info;
          }
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err + "api selectstorage");
        });
      this.getZoneData();
    },

    getStorageInfo() {
      this.$axios
        .get("/dashboard/storage/api/view", {})
        .then((res) => {
          this.all_storage_info = res.data.storage_info;
          var max_count = 0;
          this.all_storage_info.forEach((element) => {
            if (max_count < element.sector.length) {
              this.sector_number = [];
              element.sector.forEach((element) => {
                this.sector_number.push(element.sector_number);
              });
              max_count = element.sector.length;
            }
          });
        })
        .catch((err) => {
          alert(err + "api get");
        });
    },
    formatDate(date) {
      var d = new Date(date);
      var month = "" + (d.getMonth() + 1);
      var day = "" + d.getDate();
      var year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-") + " ";
    },
  },
  mounted() {
    this.checkAppleData();
    this.getZoneData();
    this.getStorageInfo();
    setInterval(() => {
      this.checkAppleData();
    }, 5000);
    setInterval(() => {
      this.getZoneData();
    }, 60000);
  },
  watch: {
    //vuex 변수의 값이 변함을 감지하는 곳
    chartZoneTempData() {
      this.chartZoneTempData["datasets"][0]["data"].forEach(
        (element, index) => {
          if (element >= -18) {
            var alarm_message_1 =
              "Zone : " +
              this.storage_info.zone_number +
              " 영하 18도 이상  " +
              this.formatDate(new Date()) +
              this.chartZoneTempData["labels"][index];
            this.Insert(alarm_message_1);
          }
          if (element <= -19) {
            var alarm_message_2 =
              "Zone : " +
              this.storage_info.zone_number +
              " 영하 19도 이하  " +
              this.formatDate(new Date()) +
              this.chartZoneTempData["labels"][index];
            this.Insert(alarm_message_2);
          }
        }
      );
    },
    chartZoneHumidData() {
      this.chartZoneHumidData["datasets"][0]["data"].forEach(
        (element, index) => {
          if (element >= 95) {
            var alarm_message_3 =
              "Zone : " +
              this.storage_info.zone_number +
              " 습도 95% 이상  " +
              this.formatDate(new Date()) +
              this.chartZoneHumidData["labels"][index];
            this.Insert(alarm_message_3);
          }
          if (element <= 90) {
            var alarm_message_4 =
              "Zone : " +
              this.storage_info.zone_number +
              " 습도 90% 이하  " +
              this.formatDate(new Date()) +
              this.chartZoneHumidData["labels"][index];
            this.Insert(alarm_message_4);
          }
        }
      );
    },
  },
};
</script>