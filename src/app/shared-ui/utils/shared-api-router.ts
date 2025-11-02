export const signalRRouter = {
  hubUrl: `/signalr_hub`
};

export const authenticationRouter = {
  loginJWT: `/auth/v1/authentication/jwt/login`,
  changePassword: `/auth/v1/authentication/change-password`,
  updatePasswordForgotByUser: `/auth/v1/authentication/forgot/update-password`,
  getAccessToken: `/auth/v1/oidc/access-token?_allow_anonymous=true`,
  refreshToken: `/auth/v1/oidc/refresh-token`,
  revokeToken: `/auth/v1/oidc/revoke-token`,
  getUserInfo: `/auth/v1/oidc/user-info`,
  introspectToken: `/auth/v1/oidc/introspect-token`,
  validateHouTicket: `/auth/v1/hou/validate-ticket`
};

export const cacheRouter = {
  removeAllCache: '/api/v1/cache/clean-all-cache'
};

export const sharedUserRouter = {
  updateUserInfo: '/api/v1/user/update-user-info',
  getCurrentUser: '/api/v1/user/get-current-user',
  getUserPermission: `/api/v1/user/get-permission-current-user`,
  getUserAccessLop: `/api/v1/user/get-access-lop-current-user`
};
export const boMonRouter = {
  getCombobox: `/api/v1/bo-mon/for-combobox`,
  getListBoMon: `/api/v1/bo-mon/filter`,
  getGvThuocBoMon: `/api/v1/bo-mon/giang-vien-filter`,
  getGvChuaGanBoMon: `/api/v1/bo-mon/giang-vien-chua-gan-filter`,
  getMonHocThuocBoMon: `/api/v1/bo-mon/mon-hoc-filter`,
  getMonHocChuaGanBoMon: `/api/v1/bo-mon/mon-hoc-chua-gan-filter`,
  createBoMon: `/api/v1/bo-mon`,
  updateBoMon: `/api/v1/bo-mon/`,
  getById: `/api/v1/bo-mon/`,
  deleteListBoMon: `/api/v1/bo-mon/delete-many`,
  createGiangVienBoMon: `/api/v1/bo-mon/create-bo-mon-giang-vien`,
  deleteGiangVienBoMon: `/api/v1/bo-mon/delete-bo-mon-giang-vien`,
  updateMonHocBoMon: `/api/v1/bo-mon/update-mon-hoc-bo-mon`
};

export const monHocRouter = {
  getFilter: `/api/v1/mon-hoc/filter`,
  create: `/api/v1/mon-hoc`,
  update: `/api/v1/mon-hoc/`,
  delete: `/api/v1/mon-hoc/`,
  getCombobox: `/api/v1/mon-hoc/for-combobox`
};
export const heRouter = {
  getCombobox: `/api/v1/he/for-combobox`
};

export const permissionRouter = {
  getListCombobox: `/api/v1/permission/for-combobox`
};

export const workflowRouter = {
  getHistoryWorkflow: `/api/v1/workflow/history-approval/`,
  getComboboxWorkflow: `/api/v1/workflow/for-combobox`
};
