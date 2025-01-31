import express from "express";

import {
  createUserRequest,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
  deleteUserRequest,
  refreshEmailToken,
  updateEmailRequest,
} from "../controller/user-controller";
import {
  verifyAccessToken,
  verifyAccessTokenForUpdate,
  verifyEmailToken,
  verifyIsAdmin,
  verifyIsOwnerOrAdmin,
} from "../middleware/basic-access-control";

const router = express.Router();

router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.patch(
  "/:id/privilege",
  verifyAccessToken,
  verifyIsAdmin,
  updateUserPrivilege
);

router.post("/", createUserRequest);

router.patch("/:id/resend-request", verifyEmailToken, refreshEmailToken);

router.delete("/:email/request", deleteUserRequest);

router.get("/:id", verifyAccessTokenForUpdate, verifyIsOwnerOrAdmin, getUser);

router.patch(
  "/:id",
  verifyAccessTokenForUpdate,
  verifyIsOwnerOrAdmin,
  updateUser
);

router.post(
  "/:id/email-update-request",
  verifyAccessToken,
  verifyIsOwnerOrAdmin,
  updateEmailRequest
);

router.delete(
  "/:id",
  verifyAccessTokenForUpdate,
  verifyIsOwnerOrAdmin,
  deleteUser
);

export default router;
