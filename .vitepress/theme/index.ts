import Theme from "vitepress/theme";
// @ts-ignore
import Archives from "./pages/Archives.vue";
// @ts-ignore
import Tags from "./pages/Tags.vue";
// @ts-ignore
import Home from "./pages/Home.vue";
// @ts-ignore
import Me from "./pages/Me.vue"
// @ts-ignore
import MyLayout from "./components/MyLayout.vue";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import type { EnhanceAppContext } from "vitepress";

import "./custom.css";

export default {
  extends: Theme,
  Layout: MyLayout,
  enhanceApp({ app, router }: EnhanceAppContext) {
    app.component("Archives", Archives);
    app.component("Tags", Tags);
    app.component("Home", Home);
    app.component("Me", Me);
    app.use(TwoslashFloatingVue);
    
    // 移除路由守卫，让各个组件自己处理滚动
  },
};
