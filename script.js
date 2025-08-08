document.getElementById('etax-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const data = {
    orderChannel: document.getElementById('order-channel').value,
    referenceNumber: document.getElementById('reference-number').value,
    idCard: document.getElementById('id-card').value,
    fullName: document.getElementById('full-name').value,
    address: document.getElementById('address').value,
    email: document.getElementById('email').value,
  };

  // TODO: implement API call to submit form data
  console.log('Form submitted', data);
});
