
const { useState } = React;

function validateThaiId(id) {
  if (!/^\d{13}$/.test(id)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 12; i += 1) {
    sum += Number(id.charAt(i)) * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === Number(id.charAt(12));
}

function EtaxForm() {
  const [form, setForm] = useState({
    orderChannel: '',
    referenceNumber: '',
    idCard: '',
    fullName: '',
    address: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!form.orderChannel.trim()) newErrors.orderChannel = 'กรุณาระบุช่องทางการสั่งซื้อ';
    if (!form.referenceNumber.trim()) newErrors.referenceNumber = 'กรุณาระบุเลขอ้างอิง';
    if (!validateThaiId(form.idCard)) newErrors.idCard = 'เลขบัตรประชาชนไม่ถูกต้อง';
    if (!form.fullName.trim()) newErrors.fullName = 'กรุณาระบุชื่อ-นามสกุล';
    if (!form.address.trim()) newErrors.address = 'กรุณาระบุที่อยู่';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) newErrors.email = 'อีเมลไม่ถูกต้อง';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    // TODO: implement API call to submit form data
    console.log('Form submitted', form);
  }

  return (
    <div className="container">
      <h1>Food Promart E-TAX</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="orderChannel">ช่องทางการสั่งซื้อ</label>
          <input
            id="orderChannel"
            name="orderChannel"
            value={form.orderChannel}
            onChange={handleChange}
          />
          {errors.orderChannel && <span className="error">{errors.orderChannel}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="referenceNumber">เลขอ้างอิง</label>
          <input
            id="referenceNumber"
            name="referenceNumber"
            value={form.referenceNumber}
            onChange={handleChange}
          />
          {errors.referenceNumber && <span className="error">{errors.referenceNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="idCard">เลขบัตร ปชช</label>
          <input
            id="idCard"
            name="idCard"
            value={form.idCard}
            onChange={handleChange}
            maxLength="13"
          />
          {errors.idCard && <span className="error">{errors.idCard}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fullName">ชื่อ - นามสกุล</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">ที่อยู่</label>
          <textarea
            id="address"
            name="address"
            rows="3"
            value={form.address}
            onChange={handleChange}
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <button type="submit">ส่งข้อมูล</button>
      </form>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<EtaxForm />);

