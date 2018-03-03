import posts from '../../data/posts';

export default {
  data() {
    return {
      title: null,
      content: null,
    };
  },
  props: {
    id: {
      required: true,
    },
  },
  created() {
    const { title, content } = posts[this.id];
    this.title = title;
    this.content = content;
  },
};
