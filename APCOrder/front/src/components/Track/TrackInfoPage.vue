<template>
  <div class="flex-wrap p-2 sm:ml-64">
    <div
      class="p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"
    >
      <div class="gap-10 sticky top-0">
        <div class="flex flex-col gap-10">
          <!-- NOTE: list view -->
          <div
            class="text-gray-900 dark:text-white mb-5 pb-5 border-gray-600 border-b"
          >
            <p class="text-3xl text-center font-bold">이력 조회</p>
          </div>
          <div class="flex flex-row m-auto">
            <div class="items-center px-3">
              <label
                for="default-input"
                class="block mb-3 text-xl font-medium text-gray-900 dark:text-white"
                >이력관리번호(조회하려는 이력관리번호를 입력)</label
              >
              <input
                type="text"
                v-model="track_info.tra_mng_no"
                id="default-input"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div class="items-center px-3">
              <label
                for="default-input"
                class="block mb-3 text-xl font-medium text-gray-900 dark:text-white"
                >상품일련번호(상품일련번호를 입력)
              </label>
              <input
                type="text"
                v-model="track_info.gds_seq"
                id="default-input"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div class="items-center px-3">
              <label
                for="default-input"
                class="block mb-3 text-xl font-medium text-gray-900 dark:text-white"
                >단계구분(10:생산, 20: 유통, 30: 판매)</label
              >
              <input
                type="text"
                v-model="track_info.mng_dvs"
                id="default-input"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div class="m-auto px-3">
            <button
              @click="getTrackInfoUrl"
              class="relative inline-flex items-center px-5 py-2.5 text-xl font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              선택
            </button>
          </div>

          <div>
            <div class="gap-5 grow h-min">
              <div
                class="p-4 bg-white border rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-5"
              >
                <h5
                  class="text-2xl text-center font-bold leading-none text-gray-900 dark:text-white pb-5 border-gray-600 border-b"
                >
                  <div class="flex-wrap gap-6">
                    <button
                      v-for="(track_info, index) in all_track_info"
                      :key="index"
                      class="relative inline-flex p-0.5 mb-2 mr-2 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                      v-on:click="selectTrackInfo(index)"
                    >
                      <span
                        class="relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0"
                      >
                        {{ track_info.sale_loc[0] }}
                      </span>
                    </button>
                  </div>
                </h5>

                <div id="export" class="relative sm:rounded-lg">
                  <div class="flex flex-col">
                    <div
                      class="relative overflow-x-auto shadow-md sm:rounded-lg"
                    >
                      <table
                        class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                      >
                        <thead
                          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                        >
                          <tr>
                            <th scope="col" class="px-6 py-3">항목명</th>
                            <th scope="col" class="px-6 py-3">데이터</th>
                            <th scope="col" class="px-6 py-3">설명</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(value, key) in selected_track_info"
                            :key="key"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          >
                            <th
                              scope="row"
                              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {{ meta_data[key][0] }}
                            </th>
                            <td class="px-6 py-4">{{ value[0] }}</td>
                            <td class="px-6 py-4">{{ meta_data[key][1] }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const xml2js = require("xml2js");
const parser = new xml2js.Parser(/* options */);

export default {
  name: "app",
  data() {
    return {
      track_info: {
        tra_mng_no: "003178111111",
        gds_seq: "2",
        mng_dvs: "10",
      },
      all_track_info: [],
      selected_track_info: {},
      meta_data: {
        tel_no: ["전화번호", "전화번호"],
        dlvs_mthd_hde: ["배송방법-택배", "배송방법-택배"],
        dlvs_mthd_drc: ["배송방법-직접납품", "배송방법-직접납품"],
        dlvs_mthd_fild: ["배송방법-현장판매", "배송방법-현장판매"],
        gds_attr_dvs_40: [
          "상품속성구분",
          "10:인증정보20:검사정보30:구매정보40:가격정보",
        ],
        gr_nm: ["등급", "등급"],
        std_nm: ["규격", "규격"],
        prc_nm1: ["가격명1", "가격명1"],
        prc_1: ["가격1", "가격1"],
        prc_nm2: ["가격명2", "가격명2"],
        prc_2: ["가격2", "가격2"],
        prc_nm3: ["가격명3", "가격명3"],
        prc_3: ["가격3", "가격3"],
        resultCode: ["에러코드", "에러코드"],
        resultMsg: ["응답메세지", "응답메세지"],
        items: ["목록", "목록"],
        mng_dvs: ["단계구분", "10:생산, 20: 유통, 30: 판매"],
        tra_reg_no: ["이력등록번호", "이력등록번호"],
        grp_nm: ["경영체명", "경영체명"],
        rptv_nm: ["대표자명", "대표자명"],
        gds_nm: ["상품명", "상품명"],
        unit_qty: ["단위량", "단위량"],
        unit_cd: ["단위코드", "단위코드"],
        unit_cd_nm: ["단위코드명", "단위코드명"],
        gds_prpt: ["상품특성", "상품특성"],
        gds_seq: ["상품일련번호", "상품일련번호"],
        gds_attr_dvs_10: [
          "상품속성구분",
          "10:인증정보20:검사정보30:구매정보40:가격정보",
        ],
        mchn_nm_1: ["인증기관명", "인증기관명"],
        cert_kd_nm: ["인증/표시명", "인증/표시명"],
        cert_no: ["인증/표시번호", "인증/표시번호"],
        cert_st_dt: ["인증시작일자", "인증시작일자"],
        cert_end_dt: ["인증종료일자", "인증종료일자"],
        gds_attr_dvs_20: [
          "상품속성구분",
          "10:인증정보20:검사정보30:구매정보40:가격정보",
        ],
        insp_st_dt: ["검사시작일자", "검사시작일자"],
        insp_end_dt: ["검사종료일자", "검사종료일자"],
        insp_kd_nm: ["검사종류명", "검사종류명"],
        insp_no: ["검사번호", "검사번호"],
        mchn_nm_2: ["검사기관명", "검사기관명"],
        insp_rslt: ["검사결과", "검사결과"],
        gds_attr_dvs_30: [
          "상품속성구분",
          "10:인증정보20:검사정보30:구매정보40:가격정보",
        ],
        pur_mthd_nm: ["구매방법", "구매방법"],
        sale_loc: ["판매장", "판매장"],
        loc: ["장소", "장소"],
      },
    };
  },
  methods: {
    getTrackInfoUrl() {
      var url = "https://cors-anywhere.herokuapp.com/";
      url +=
        "http://data.naqs.go.kr/openapi/services/rest/FrmprdHistManageInfoInqireSvc/getGoodsAttrbInfoInqire"; /*URL*/
      var queryParams =
        "?" +
        encodeURIComponent("serviceKey") +
        "=" +
        "DwrUTa6PFAjNeMuw8LcmpTeOD8AcBJb6pxu43DZo7NxKfQWlNUYh%2FZdoW8afVnB%2BeqtHxWevizngU9Wwm9X1OQ%3D%3D"; /*Service Key*/
      queryParams +=
        "&" +
        encodeURIComponent("tra_mng_no") +
        "=" +
        encodeURIComponent("003178111111"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("gds_seq") +
        "=" +
        encodeURIComponent("2"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("mng_dvs") +
        "=" +
        encodeURIComponent("10"); /**/
      url += queryParams;
      this.getTrackInfo(url);
    },
    getTrackInfo(url) {
      this.$axios
        .get(url, {})
        .then((res) => {
          var json_data = [];
          parser.parseString(res.data, function (err, result) {
            console.log(err);
            result.response.body[0].items[0].item.forEach((element1, index) => {
              var keys = Object.keys(element1); //키를 가져니다.
              console.log(index + 1 + "번째");
              json_data.push({});

              keys.forEach((element2) => {
                if (element1[element2] != "") {
                  console.log(
                    "key : " + element2 + " || value : " + element1[element2]
                  );
                  json_data[index][element2] = element1[element2];
                }
              });
            });
          });
          this.all_track_info = json_data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //등록하는 부분
    getUploadUrl() {
      var url = "https://cors-anywhere.herokuapp.com/";
      url +=
        "http://data.naqs.go.kr/openapi/services/rest/FrmprdHistManageInfoCntcSvc/setGoodsAttrbInfoCntc"; /*URL*/
      var queryParams =
        "?" +
        encodeURIComponent("serviceKey") +
        "=" +
        "서비스키"; /*Service Key*/
      queryParams +=
        "&" + encodeURIComponent("proc") + "=" + encodeURIComponent("I"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("tra_reg_no") +
        "=" +
        encodeURIComponent("00317"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("gds_seq") +
        "=" +
        encodeURIComponent("1"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("gds_nm") +
        "=" +
        encodeURIComponent("테스트"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("unit_qty") +
        "=" +
        encodeURIComponent("10"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("unit_cd") +
        "=" +
        encodeURIComponent("100"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("gds_prpt") +
        "=" +
        encodeURIComponent("테스트"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("cert_kd_cd") +
        "=" +
        encodeURIComponent("1"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("cert_no") +
        "=" +
        encodeURIComponent("000000000000"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("pur_mthd_cd") +
        "=" +
        encodeURIComponent("2"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("pur_mthd_nm") +
        "=" +
        encodeURIComponent("직접방문"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("sale_loc") +
        "=" +
        encodeURIComponent("테스트"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("tel_no") +
        "=" +
        encodeURIComponent("000-0000-0000"); /**/
      queryParams +=
        "&" +
        encodeURIComponent("reg_nm") +
        "=" +
        encodeURIComponent("테스트"); /**/
      url += queryParams;
      this.OnUploadInfo(url);
    },
    OnUploadInfo(url) {
      this.$axios
        .get(url, {})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectTrackInfo(index) {
      console.log(index);
      this.selected_track_info = this.all_track_info[index];
      console.log(this.all_track_info[index]);
    },
  },
  created() {
    this.getUploadUrl();
  },
};
</script>
