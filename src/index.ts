import "./icons";
import Router from "./router";
import { cartService } from "./services/cart.service";
import { userService } from "./services/user.service";
import { eventAnalyticsService } from "./services/eventAnalytics.service";

new Router();
cartService.init();
userService.init();
eventAnalyticsService.init();

setTimeout(() => {
  document.body.classList.add("is__ready");
}, 250);
