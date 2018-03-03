import top from './Top/template.vue';
import about from './About/template.vue';
import posts from './Posts/template.vue';
import post from './Post/template.vue';

const viewMap = {
  top,
  about,
  posts,
  post,
};

export default function (id, props) {
  return {
    render(h) {
      return h(viewMap[id], { props });
    },
  };
}
