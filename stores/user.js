import { useApiAuth } from "~/composables/useApiAuth.js";
import { useGeneralStore } from "./general.js";
import { useProfileStore } from "./profile.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: "",
    name: "",
    file: "",
  }),
  actions: {
    async getTokens() {
      return await useApiAuth("/sanctum/csrf-cookie");
    },

    async login(form) {
      return await useApiAuth("/login", {
        method: "POST",
        body: form,
      });
    },

    async register(formRegister) {
      return await useApiAuth("/register", {
        method: "POST",
        body: formRegister,
      });
    },

    async getUser() {
      let res = await useApiAuth("/api/user");
      let user = res.data.value?.user[0];
      this.id = user?.id;
      this.name = user?.name;
      this.file = user?.file;

      return res;
    },

    async updateUserImage(data) {
      let res = await useApiAuth("/api/update-user-image", {
        method: "POST",
        body: data,
      });

      if (res.responses.status == 200) {
        this.file = res.data.value?.file;
        useProfileStore().file = res.data.value?.file;
      }
    },

    async updateUser(name, bio) {
      return await useApiAuth("/api/update-user", {
        method: "PATCH",
        body: {
          name: name,
          bio: bio,
        },
      });
    },

    async logout() {
      let res = await useApiAuth("/logout", {
        method: "POST",
      });
      this.id = "";
      this.name = "";
      this.bio = "";
      this.image = "";
      return res;
    },

    resetUser() {
      this.id = "";
      this.name = "";
      this.bio = "";
      this.image = "";
    },

    async createPost(data) {
      return await useApiAuth("/api/post", {
        method: "POST",
        body: data,
      });
    },

    async likePost(postId) {
      let res = await useApiAuth("/api/like", {
        method: "POST",
        body: {
          post_id: postId,
        },
      });
      this.updateLike(postId);
    },

    async unLikePost(likeId, postId) {
      let res = await useApiAuth("/api/likes/" + likeId, {
        method: "DELETE",
      });
      this.updateLike(postId);
    },

    async updateLike(postId) {
      let res = await useApiAuth(`/api/likes-post/${postId}`);
      useGeneralStore().posts.forEach((post) => {
        if (post.id == postId) {
          post.likes = res.data.value?.likes;
          return;
        }
      });
    },

    async updateComment(postId) {
      let res = await useApiAuth(`/api/comments-post/${postId}`);
      useGeneralStore().selectedPost.comments = res.data.value.comments;
    },

    async addComment(obj) {
      let res = await useApiAuth("/api/comment", {
        method: "POST",
        body: {
          post_id: obj.post_id,
          user_id: obj.user_id,
          text: obj.text,
        },
      });

      if (res.responses.status == 200) {
        await this.updateComment(obj.post_id);
      }

      return res;
    },

    async deleteComment(postId, commentId) {
      let res = await useApiAuth("/api/comments/" + commentId, {
        method: "DELETE",
      });

      if (res.responses.status == 200) {
        await this.updateComment(postId);
      }
    },

    async deletePost(postId) {
      let res = await useApiAuth("/api/posts/" + postId, {
        method: "DELETE",
      });

      if (res.responses.status == 200) {
        await this.updatePost(postId);
      }
    },

    async updatePost(postId) {
      useGeneralStore().posts = useGeneralStore().posts.filter(
        (post) => post.id != postId
      );
    },
  },

  getters: {},
  persist: true,
});
