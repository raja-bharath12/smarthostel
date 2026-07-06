/**
 * LeaveService wraps all leave-related API calls.
 */
const LeaveService = {
  async list(page, pageSize) {
    if (window.firebaseAPI && window.firebaseDb) {
      try {
        const user = ApiClient.getUser();
        const leavesRef = window.firebaseAPI.collection(window.firebaseDb, "leaves");
        const q = window.firebaseAPI.query(leavesRef, window.firebaseAPI.where("userId", "==", user.username || user.id));
        const snapshot = await window.firebaseAPI.getDocs(q);
        
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        
        return {
          success: true,
          data: data,
          pagination: { currentPage: 1, pageSize: pageSize, totalRecords: data.length, totalPages: 1 }
        };
      } catch (err) {
        console.error(err);
        return { success: false, message: 'Failed to fetch leaves from Firestore.' };
      }
    }
    return ApiClient.get(`/leaves?page=${page}&pageSize=${pageSize}`);
  },

  async apply(payload) {
    if (window.firebaseAPI && window.firebaseDb) {
      try {
        const user = ApiClient.getUser();
        const leaveId = "leave_" + Date.now();
        payload.userId = user.username || user.id;
        payload.status = 'Pending';
        payload.appliedAt = new Date().toISOString();
        
        await window.firebaseAPI.setDoc(window.firebaseAPI.doc(window.firebaseDb, "leaves", leaveId), payload);
        return { success: true };
      } catch (err) {
        console.error(err);
        return { success: false, message: 'Failed to apply leave in Firestore.' };
      }
    }
    return ApiClient.post('/leaves', payload);
  },

  async cancel(leaveId) {
    if (window.firebaseAPI && window.firebaseDb) {
      try {
        // Just mock success for cancel, or we can update the doc to Cancelled
        await window.firebaseAPI.setDoc(window.firebaseAPI.doc(window.firebaseDb, "leaves", leaveId), { status: 'Cancelled' }, { merge: true });
        return { success: true };
      } catch (err) {
        return { success: false, message: 'Failed to cancel leave.' };
      }
    }
    return ApiClient.del(`/leaves/${leaveId}`);
  },

  async getApprovalDetails(leaveId) {
    if (window.firebaseAPI && window.firebaseDb) {
      return { success: true, approvals: [] }; // mock approval details
    }
    return ApiClient.get(`/leaves/${leaveId}/approvals`);
  },
};
