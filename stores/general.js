export const useGeneralStore = defineStore("general", {
  state: () => ({
    isLoginOpen: false,
    isEditProfileOpen: false,
    selectedPost: null,
    ids: null,
    isBackUrl: "/",
    posts: [],
    allUsers: null,
    suggested: null,
    following: null,
  }),
  actions: {
    bodySwitch(val) {
      if (val) {
        document.body.style.overflow = "hidden";
        return;
      }
      document.body.style.overflow = "visible";
    },

    allLowerCaseNoCaps(str) {
      return str.split(" ").join("").toLowerCase();
    },

    setBackUrl(url) {
      this.isBackUrl = url;
    },

    async getRandomUsers() {
      let res = await useApiAuth("/api/get-random-users");

      this.suggested = res.data.value.suggested;
      this.following = res.data.value.following;
    },

    updateSideMenuImage(arr, userId, userImage) {
      for (let i = 0; i < arr.length; i++) {
        const res = arr[i];
        if (res.id == userId) {
          res.image = userImage;
        }
      }
    },

    async getAllUsersAndPosts() {
      let res = await useApiAuth("/api/home", {
        include: "",
      });
      this.posts = res.data.value?.posts;
      this.allUsers = res.data.value?.allUsers;
    },

    async getPostById(id) {
      let res = await useApiAuth("/api/posts/" + id);
      this.selectedPost = res.data.value?.post[0];
      this.ids = res.data.value.ids ?? [];
      return res;
    },
  },
  getters: {},
  persist: true,
});
