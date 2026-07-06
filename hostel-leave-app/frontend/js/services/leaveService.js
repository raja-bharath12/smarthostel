/**
 * LeaveService wraps all leave-related API calls.
 */
const LeaveService = {
  async list(page, pageSize) {
    return ApiClient.get(`/leaves?page=${page}&pageSize=${pageSize}`);
  },

  async apply(payload) {
    return ApiClient.post('/leaves', payload);
  },

  async cancel(leaveId) {
    return ApiClient.del(`/leaves/${leaveId}`);
  },

  async getApprovalDetails(leaveId) {
    return ApiClient.get(`/leaves/${leaveId}/approvals`);
  },
};
