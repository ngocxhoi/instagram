import { useApiAuth } from "~/composables/useApiAuth.js";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    id: "",
    name: "",
    file: "",
    posts: [],
    allLikes: 0,
  }),
  actions: {
    resetUser() {
      this.id = "";
      this.name = "User name";
      this.file = "/user-placeholder.png";
      this.posts = [];
    },

    allLikesCount() {
      this.allLikes = 0;
      for (let i = 0; i < this.posts.length; i++) {
        const post = this.posts[i];
        this.allLIkes += post.likes.length;
      }
    },

    async getProfile(id) {
      this.resetUser();
      let res = await useApiAuth(`/api/profiles/${id}`);
      const user = res.data.value.user[0];

      this.id = user.id;
      this.name = user.name;
      this.file = user.file;

      this.posts = res.data.value.postsByUser;

      // this.allLikesCount();
    },
  },
  persist: true,
});
