const sidebar = document.querySelector('#sidebar');
const overlay = document.querySelector('#sidebar-overlay');
const menuToggle = document.querySelector('#menu-toggle');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
}
function closeMenu() {
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const isOpen = !sidebar.classList.contains('-translate-x-full');
  if (isOpen) closeMenu();
  else {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
});
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('#sidebar a').forEach(link => link.addEventListener('click', closeMenu));

// Filter table rows without breaking the responsive overflow container.
const statusFilter = document.querySelector('#status-filter');
const tableRows = [...document.querySelectorAll('#orders-body tr')];
function filterOrders() {
  const status = statusFilter.value;
  let visible = 0;
  tableRows.forEach(row => {
    const matches = status === 'all' || row.querySelector('.badge').textContent.trim() === status;
    row.classList.toggle('hidden', !matches);
    if (matches) visible += 1;
  });
  document.querySelector('#table-empty').classList.toggle('hidden', visible !== 0);
  document.querySelector('#order-count').textContent = `Showing ${visible} of 1,482 orders`;
}
statusFilter.addEventListener('change', filterOrders);

// Search customer names, emails, and order IDs in the visible table.
document.querySelector('#search-input').addEventListener('input', event => {
  const query = event.target.value.trim().toLowerCase();
  let visible = 0;
  tableRows.forEach(row => {
    const matches = row.textContent.toLowerCase().includes(query) && (statusFilter.value === 'all' || row.querySelector('.badge').textContent.trim() === statusFilter.value);
    row.classList.toggle('hidden', !matches);
    if (matches) visible += 1;
  });
  document.querySelector('#table-empty').classList.toggle('hidden', visible !== 0);
  document.querySelector('#order-count').textContent = `Showing ${visible} of 1,482 orders`;
});

document.querySelector('#jump-add-user').addEventListener('click', () => {
  document.querySelector('#add-user').scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.querySelector('#add-user input[name="fullName"]').focus({ preventScroll: true });
});
document.querySelector('#export-btn').addEventListener('click', () => {
  const rows = [['Order ID', 'Customer', 'Date', 'Amount', 'Status']];
  tableRows.filter(row => !row.classList.contains('hidden')).forEach(row => {
    const cells = row.querySelectorAll('td');
    rows.push([cells[0].innerText, cells[1].innerText.replace(/\n/g, ' '), cells[2].innerText, cells[3].innerText, cells[4].innerText]);
  });
  const csv = rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'mintly-orders.csv';
  anchor.click();
  URL.revokeObjectURL(url);
  showToast('Your order report has been exported.');
});
document.querySelector('#view-orders').addEventListener('click', () => showToast('You are viewing the latest 6 sample orders.'));

document.querySelector('#user-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = data.get('fullName').trim();
  const email = data.get('email').trim();
  const role = data.get('role');
  const message = document.querySelector('#form-message');
  message.textContent = `Invitation preview ready for ${name} (${email}) as ${role}. This demo does not send real email.`;
  message.classList.remove('hidden');
  showToast('Invitation preview created. No email was sent.');
});
document.querySelector('#user-form').addEventListener('reset', () => {
  document.querySelector('#form-message').classList.add('hidden');
});
