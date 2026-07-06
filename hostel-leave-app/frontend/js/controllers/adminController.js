document.addEventListener('DOMContentLoaded', async () => {
  if (!ApiClient.isAuthenticated() || ApiClient.getUser().role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await AuthService.logout();
    window.location.href = 'login.html';
  });

  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    sb.style.display = sb.style.display === 'block' ? 'none' : 'block';
  });

  const tbody = document.getElementById('usersTableBody');

  try {
    if (!window.firebaseAPI) {
      throw new Error("Firebase SDK is not loaded yet.");
    }

    const usersRef = window.firebaseAPI.collection(window.firebaseDb, "users");
    const querySnapshot = await window.firebaseAPI.getDocs(usersRef);

    if (querySnapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';
      return;
    }

    let html = '';
    let index = 1;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const dateStr = data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A';
      html += `
        <tr>
          <td>${index++}</td>
          <td><strong>${data.username}</strong></td>
          <td>${data.email}</td>
          <td>${dateStr}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="4" style="color:red;">Error loading users: ${err.message}</td></tr>`;
    Toast.show('Error loading users from database.', true);
  }
});
