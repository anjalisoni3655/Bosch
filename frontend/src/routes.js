import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";

import Maps from "views/Map.js";
import modifyData from "views/modifyData.js";
import AddData from "views/addData.js";

import UpgradeToPro from "views/Upgrade.js";
import ModelPerformance from "views/ModelPeformance";

var routes = [
  {
    path: "/upload-dataset",
    name: "Upload Dataset",
    icon: "nc-icon nc-single-02",
    component: AddData,
  },
  {
    path: "/augment-modify",
    name: "Augment and modify",
    icon: "nc-icon nc-tile-56",
    component: modifyData,
  },
  {
    path: "/view-data-stats",
    name: "View Data Stats",
    icon: "nc-icon nc-caps-small",
    component: Dashboard,
  },
  {
    path: "/model-performance",
    name: "Model Peformance",
    icon: "nc-icon nc-caps-small",
    component: ModelPerformance,
  },
  {
    path: "/model-summary",
    name: "Model Summary",
    icon: "nc-icon nc-caps-small",
    component: ModelPerformance,
  },
  {
    path: "/model-analysis",
    name: "Model Analysis",
    icon: "nc-icon nc-caps-small",
    component: Icons,
  },
  {
    path: "/know-more",
    name: "Know More",
    icon: "nc-icon nc-caps-small",
    component: Icons,
  },
];
export default routes;
