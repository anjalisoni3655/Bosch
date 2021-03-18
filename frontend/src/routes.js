import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import Augment from "views/augment.js";
import Maps from "views/Map.js";

import UploadData from "views/modifyData.js";

import UpgradeToPro from "views/Upgrade.js";

var routes = [
  {
    path: "/upload-dataset",
    name: "Upload Dataset",
    icon: "nc-icon nc-single-02",
    component: UploadData,
  },
  {
    path: "/augment-modify",
    name: "Augment and modify",
    icon: "nc-icon nc-tile-56",
    component: Augment,
  },
  {
    path: "/view-data-stats",
    name: "View Data Stats",
    icon: "nc-icon nc-caps-small",
    component: Typography,
  },
  {
    path: "/view-model-stat",
    name: "View Model Stats",
    icon: "nc-icon nc-caps-small",
    component: Typography,
  },
];
export default routes;
