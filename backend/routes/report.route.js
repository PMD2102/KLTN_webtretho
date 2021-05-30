const router = require("express").Router();

const { reportController } = require("../controllers");
const { isAuth, isAdmin } = require("../middleware");

router
  .route("/")
  .get(isAuth, isAdmin, reportController.getReports)
  .post(isAuth, reportController.createReport)
  .delete(isAuth, isAdmin, reportController.deleteReport);

module.exports = router;
