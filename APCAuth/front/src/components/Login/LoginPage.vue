<template>
  <div class="flex-wrap p-2 sm:ml-64">
    <div
      class="p-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"
    >
      <div class="max-w-[48rem] min-w-[18rem] mx-auto">
        <div
          class="grid md:grid-cols-2 md:gap-6 relative z-0 mb-6 w-full group"
        >
          <input
            type="text"
            name="floating_user_id"
            id="floating_user_id"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required=""
            v-model="user.user_id"
          />
          <label
            for="floating_alias"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            아이디</label
          >
        </div>

        <div class="grid md:grid-cols-2 md:gap-6">
          <div class="relative z-0 mb-6 w-full group">
            <input
              type="password"
              name="floating_password"
              id="floating_password"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required=""
              v-model="user.password"
            />
            <label
              for="floating_password"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              비밀번호
            </label>
          </div>
        </div>

        <button
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="login"
        >
          로그인
        </button>
        <button
          class="text-white m-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <a href="/users/signup">가입하기</a>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        user_id: "",
        password: "",
      },
    };
  },

  mounted() {
    // keyboard event listener를 해당 페이지에서 전역적으로 추가
    window.addEventListener('keyup', this.handleEnterKey);
  },
  beforeUnmount() {
    // 페이지 이동하면 event listener를 제거
    window.removeEventListener('keyup', this.handleEnterKey);
  },

  methods: {
    login: function () {
      this.$emitter.emit("eventMethod", "event 전송"); //emit(component 간의 event 통신) 확인
      this.$axios
        //로그인
        .post("/users/api/login", {
          user: this.user,
        })
        .then((res) => {
          if (res.data.success == true) {
            console.log(res.data);
            this.$store.commit("setUserInfo", res.data.user_info);
            console.log(this.$store.getters.getUserRole);
            this.$router.push("/users");
          }
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err);
        });
    },
    handleEnterKey(e) {
      // enter 눌렀을 때 event 처리
      if (e.key === 'Enter') {
        this.login();
      }
    }
  },
};
</script>

<style></style>
