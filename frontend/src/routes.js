import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";

import Maps from "views/Map.js";
import modifyData from "views/modifyData.js";
import AddData from "views/addData.js";
// import CustomizedDialogs from "views/Dialog.js";
import UpgradeToPro from "views/Upgrade.js";
import ModelPerformance from "views/ModelPeformance";
import PostEvaluation from "views/PostEvalution";

var routes = [
  {
    path: "/upload-dataset",
    name: "Upload Dataset",
    icon: "nc-icon nc-cloud-upload-94",
    component: AddData,
  },
  {
    path: "/augment-modify",
    name: "Augment and modify",
    icon: "nc-icon nc-settings",
    component: modifyData,
  },
  {
    path: "/view-data-stats",
    name: "View Data Stats",
    icon: "nc-icon nc-chart-bar-32",
    component: Dashboard,
  },
  {
    path: "/model-performance",
    name: "Model Peformance",
    icon: "nc-icon nc-vector",
    component: ModelPerformance,
  },
  {
    path: "/post-evaluation",
    name: "Post Evaluation",
    icon: "nc-icon nc-zoom-split",
    component: PostEvaluation,
  },
  // {
  //   path: "/model-analysis",
  //   name: "Model Analysis",
  //   icon: "nc-icon nc-caps-small",
  //   component: Icons,
  // },
  // {
  //   path: "/know-more",
  //   name: "Know More",
  //   icon: "nc-icon nc-caps-small",
  //   component: Icons,
  // },
];
export default routes;
