const store = require('./repositories/jsonStore');
const userRepository = require('./repositories/userRepository');
const leaveRepository = require('./repositories/leaveRepository');
const approvalRepository = require('./repositories/approvalRepository');

function seedIfEmpty() {
  if (store.table('users').length > 0) return;

  const user = userRepository.create({
    username: '24CS232',
    password: 'password123',
    full_name: '24CS232',
    parent_phone: '9791885351',
  });

  const leavesSeed = [
    ['Leave', '176947', '05-07-2026 05:11:17 AM', '05-07-2026 11:11:17 PM', 'Self', 2, 'Holiday', 'Submitted'],
    ['Leave', '176787', '04-07-2026 05:00:00 AM', '05-07-2026 11:29:19 PM', 'Self', 1, 'Holiday', 'Cancelled'],
    ['Leave', '175586', '25-06-2026 12:45:00 PM', '28-06-2026 08:02:37 AM', 'Self', 2, 'Holiday', 'Closed'],
    ['Leave', '173831', '14-06-2026 05:05:08 AM', '14-06-2026 11:06:08 PM', 'Self', 1, 'Holiday', 'Closed'],
    ['Vacation Leave', '172893', '29-04-2026 04:30:00 PM', '31-05-2026 02:08:54 PM', 'Self', 2, 'Summer vacation', 'ForciblyClosed'],
    ['Leave', '166830', '04-04-2026 05:00:39 PM', '13-04-2026 12:00:00 PM', 'Self', 1, 'Holiday', 'Closed'],
    ['Leave', '161233', '18-03-2026 04:15:00 PM', '31-03-2026 08:47:00 PM', 'Self', 1, 'Holiday', 'Closed'],
    ['Leave', '158496', '14-03-2026 04:15:00 PM', '15-03-2026 10:38:48 AM', 'Self', 1, 'Leave', 'Closed'],
    ['Leave', '155611', '08-03-2026 06:00:04 AM', '08-03-2026 11:30:04 PM', 'Self', 1, 'Leave', 'Closed'],
    ['Leave', '151131', '21-02-2026 06:00:30 PM', '22-02-2026 11:59:00 PM', 'Self', 1, 'Going to Hospital', 'Closed'],
  ];

  const facultyChain = [
    ['IVR IVR', 'IVR', 1],
    ['3CSEC3 3CSEC3', 'Class Advisor', 2],
    ['SKCETCSEHOD SKCETCSEHOD', 'HOD', 3],
    ['Babu N', 'Deputy Warden', 4],
    ['SRINIVASAN V P', 'Deputy Warden', 4],
    ['Sriram Kumar K', 'Residential Warden', 4],
    ['Rajkumar M', 'Warden', 4],
    ['Boopathy C', 'Residential Warden', 4],
  ];

  leavesSeed.forEach(
    ([leave_type, application_no, from_date, to_date, accompanying_person, call_count, leave_reason, status]) => {
      const leave = leaveRepository.create({
        user_id: user.id,
        leave_type,
        application_no,
        from_date,
        to_date,
        accompanying_person,
        call_count,
        leave_reason,
        status,
      });

      facultyChain.forEach(([staff_name, designation, approval_order], idx) => {
        if (idx === 0) {
          approvalRepository.createFacultyApproval({
            leave_id: leave.id,
            staff_name,
            designation,
            approval_order,
            approved_date: '02-07-2026 10:13:19 PM',
            status: 'Approved',
            approved_by: 'Parent',
          });
        } else if (idx === 1) {
          approvalRepository.createFacultyApproval({
            leave_id: leave.id,
            staff_name,
            designation,
            approval_order,
            approved_date: '03-07-2026 09:01:37 AM',
            status: 'Approved',
            approved_by: '3CSEC3 3CSEC3',
          });
        } else {
          approvalRepository.createFacultyApproval({
            leave_id: leave.id,
            staff_name,
            designation,
            approval_order,
            approved_date: null,
            status: 'Submitted',
            approved_by: null,
          });
        }
      });

      approvalRepository.createParentApproval({
        leave_id: leave.id,
        ivr_approval_no: '9791885351',
        order_no: 1,
        call_date: '02-07-2026 10:12:53 PM',
        status: 'Call Answer',
      });
      approvalRepository.createParentApproval({
        leave_id: leave.id,
        ivr_approval_no: '9791885351',
        order_no: 1,
        call_date: '02-07-2026 10:11:54 PM',
        status: 'Call Answer',
      });
    }
  );

  console.log('Seed data inserted.');
}

module.exports = { seedIfEmpty };
