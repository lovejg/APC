<template>
  <div class="flex-wrap p-2 sm:ml-64">
    <div class="p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
      <div class="inline-flex flex-row gap-4 mb-2">
        <div class="inline-flex flex-col">
          <div class="flex gap-4 mb-4">
            <iframe id="iframeExample" width="1100" height="605" src="https://e1cc-118-36-223-138.ngrok-free.app/webgl2/"
              frameborder="0" framespacing="0" marginheight="0" marginwidth="0" scrolling="no" vspace="0" />
          </div>

          <div class="inline-flex">
            <div class="flex flex-row">
              <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-white-700">
                <div class="flex flex-row">
                  <div class="flex">
                    <Bar :options="chartGradeOptions" :data="chartGradeData" width="500" height="215" />
                  </div>
                  <div class="flex">
                    <Bar :options="chartSectorOptions" :data="chartSectorData" width="600" height="215" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="inline-flex">
          <div>
            <div class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"></div>
            <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-white-700">
              <div class="flex items-center px-3 py-2">
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

                <div class="inline-flex items-center px-3 py-2">
                  <button @click="selectStorage(storage_info.zone_number)"
                    class="relative inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    선택
                  </button>
                </div>
              </div>
              <h5 class="mb-2 text-4xl font-semibold text-center tracking-tight text-gray-500 dark:text-gray">
                Zone {{ select_storage_info.zone_number }}
              </h5>
              <h2 class="mb-2 text-8xl font-bold text-center tracking-tight text-black-900 dark:text-black">
                {{
                  all_storage_info[select_storage_info.zone_number - 1]
                    .zone_all_quantity
                }}
                kg
              </h2>

              <h5 class="mb-2 text-2xl font-semibold text-center tracking-tight text-gray-900 dark:text-gray">
                최근 입고 :
                {{
                  all_storage_info[select_storage_info.zone_number - 1]
                    .import_date_time
                }}
              </h5>
              <h5 class="mb-2 text-2xl font-semibold text-center tracking-tight text-gray-900 dark:text-gray">
                최근 출고 :
                {{
                  all_storage_info[select_storage_info.zone_number - 1]
                    .export_date_time
                }}
              </h5>
              <div class="flex gap-4 mb-4">
                <Line :options="chartZoneTempOptions" :data="chartZoneTempData" width="500" height="250" />
              </div>
              <div class="flex gap-4 mb-4">
                <Line :options="chartZoneHumidOptions" :data="chartZoneHumidData" width="500" height="250" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../firebase";
import { ref, set } from "firebase/database";
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

import * as chartZoneTempConfig from "./ChartData/ChartSectorTempData.js";
import * as chartZoneHumidConfig from "./ChartData/ChartSectorHumidData.js";
import * as chartGradeConfig from "./ChartData/ChartGradeData.js";
import * as chartSectorConfig from "./ChartData/ChartSectorData.js";

export default {
  name: "DashBoard",
  components: { Bar, Line },
  data() {
    return {
      showModal: false,
      chartZoneTempData: chartZoneTempConfig.randomData(),
      chartZoneTempOptions: chartZoneTempConfig.options,
      chartZoneHumidData: chartZoneHumidConfig.randomData(),
      chartZoneHumidOptions: chartZoneHumidConfig.options,
      chartGradeData: chartGradeConfig.randomData(),
      chartGradeOptions: chartGradeConfig.options,
      chartSectorData: chartSectorConfig.randomData(),
      chartorOptions: chartSectorConfig.options,
      storage_info: {
        zone_number: 1,
        sector_number: 1,
      },
      select_storage_info: {
        zone_number: 1,
        sector_number: 1,
      },
      all_storage_info: [{ zone_all_quantity: 0 }],
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

    getZoneData() {
      this.$axios
        .post("/dashboard/kafka/storage/api/view", {
          zone_number: this.storage_info.zone_number,
        })
        .then((res) => {
          console.log(res.data["temp_data_time"]);
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
    selectStorage(zone_number) {
      this.select_storage_info = this.all_storage_info[zone_number - 1];
      console.log(this.all_storage_info);

      this.chartGradeData = {
        labels: ["A", "B", "C", "가공"],
        datasets: [
          {
            label: "Zone 등급 데이터",
            data: [
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .zone_grade.A,
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .zone_grade.B,
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .zone_grade.C,
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .zone_grade.가공,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255, 205, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
            ],
          },
        ],
      };
      this.chartSectorData = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        datasets: [
          {
            label: "sector 별 재고 상황",
            data: [
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[0],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[1],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[2],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[3],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[4],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[5],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[6],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[7],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[8],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[9],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[10],
              this.all_storage_info[this.select_storage_info.zone_number - 1]
                .sector_quantity[11],
            ],
            backgroundColor: [
              "rgb(255, 99, 71,1)",
              "rgb(255, 99, 132,1)",
              "rgb(255, 129, 98, 1)",
              "rgb(255, 159, 64,1)",
              "rgb(255, 205, 86,1)",
              "rgb(75, 192, 192,1)",
              "rgb(0, 128, 128,1)",
              "rgb(54, 162, 235,1)",
              "rgb(127.5, 49.5, 35.5,1)",
              "rgb(153, 102, 255,1)",
              "rgb(201, 203, 207,1)",
              "rgb(0, 0, 0,1)",
            ],
            borderColor: [
              "rgb(255, 99, 71)",
              "rgb(255, 99, 132)",
              "rgb(255, 129, 98)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(0, 128, 128)",
              "rgb(54, 162, 235)",
              "rgb(127.5, 49.5, 35.5)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
              "rgb(0, 0, 0)",
            ],
          },
        ],
      };

      this.getZoneData();
    },

    getStorageInfo() {
      this.$axios
        .get("/dashboard/storage/api/view", {})
        .then((res) => {
          this.all_storage_info = res.data.storage_info;
          console.log(this.all_storage_info);
          let sector_isEmpty = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          let zone_isEmpty = true;
          this.all_storage_info.forEach((zone, zone_number) => {
            let zone_all_quantity = 0;
            let zone_grade = {
              A: 0,
              B: 0,
              C: 0,
              가공: 0,
            };
            let sector_quantity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            console.log("zone sector");
            console.log(zone.sector);
            console.log("zone");
            console.log(zone);
            zone.sector.forEach((Sector, index) => {
              Sector.pallet.forEach((pallets) => {
                sector_quantity[index] += pallets.quantity;


              });
              var item = sector_quantity[index];
              console.log(Sector);
              if (item != 0) {
                sector_isEmpty[index] = 1;
                zone_isEmpty = false;
              }
              const Ref = ref(
                firebase,
                "/ColdStorage/ColdStorage/" +
                "Sector" +
                (zone_number + 1) +
                "/Part" +
                (index + 1)
              );
              set(Ref, item.toString());
              console.log("in loop" + Sector.grade);

              console.log(1);

              zone_grade[Sector.grade] += sector_quantity[index];
              zone_all_quantity += sector_quantity[index];
            });//내부반복문끝

            zone.zone_all_quantity = zone_all_quantity;
            zone.zone_grade = zone_grade;
            zone.import_date_time = zone.import_date_time
              .replace("T", " ")
              .slice(0, 19);
            zone.export_date_time = zone.export_date_time
              .replace("T", " ")
              .slice(0, 19);
            zone.sector_quantity = sector_quantity;
            if (!zone_isEmpty) {
              console.log("zone not isempty");
              var k = 0;
              zone.sector.forEach((Sector, index) => {
                k = index;
                console.log("zone number" + zone_number);
                console.log("index " + index);
                const stateRef = ref(
                  firebase,
                  "/ColdStorage/State/" +
                  "Sector" +
                  (zone_number + 1) +
                  "/Part" +
                  (index + 1)
                );
                if (sector_isEmpty[index] > 0) {
                  set(stateRef, "1" + Sector.grade);
                  console.log(typeof Sector.grade);
                  console.log("loop" + Sector.grade);
                } else {
                  set(stateRef, "0");

                }
              });
              for (var i = k + 2; i <= 12; i++) {
                const stateRef = ref(
                  firebase,
                  "/ColdStorage/State/" +
                  "Sector" +
                  (zone_number + 1) +
                  "/Part" +
                  (i)
                );
                set(stateRef, "0");
              }
            } else {
              for (var j = 0; j < 12; j++) {
                const stateRef = ref(
                  firebase,
                  "/ColdStorage/State/" +
                  "Sector" +
                  (zone_number + 1) +
                  "/Part" +
                  (j + 1)
                );
                set(stateRef, "0");
              }
            }
          });
        })
        .catch((err) => {
          console.log(err);
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
    this.getZoneData();
    this.getStorageInfo();
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
              this.select_storage_info.zone_number +
              " 영하 18도 이상  " +
              this.formatDate(new Date()) +
              this.chartZoneTempData["labels"][index];
            this.Insert(alarm_message_1);
          }
          if (element <= -19) {
            var alarm_message_2 =
              "Zone : " +
              this.select_storage_info.zone_number +
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
              this.select_storage_info.zone_number +
              " 습도 95% 이상  " +
              this.formatDate(new Date()) +
              this.chartZoneHumidData["labels"][index];
            this.Insert(alarm_message_3);
          }
          if (element <= 90) {
            var alarm_message_4 =
              "Zone : " +
              this.select_storage_info.zone_number +
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
