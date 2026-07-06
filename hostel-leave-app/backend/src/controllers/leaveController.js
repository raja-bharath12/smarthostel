const leaveService = require('../services/leaveService');

class LeaveController {
  list(req, res) {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '10', 10);

    const result = leaveService.listForUser(req.user.id, page, pageSize);
    res.json({ success: true, ...result });
  }

  apply(req, res) {
    const result = leaveService.applyLeave(req.user.id, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  }

  cancel(req, res) {
    const result = leaveService.cancelLeave(req.user.id, req.params.id);

    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }

    res.json(result);
  }

  approvals(req, res) {
    const result = leaveService.getApprovalDetails(req.user.id, req.params.id);

    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }

    res.json(result);
  }
}

module.exports = new LeaveController();
