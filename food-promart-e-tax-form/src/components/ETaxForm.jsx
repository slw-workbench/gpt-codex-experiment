import React, { useState, useEffect } from 'react'
import Input from './Input'
import Select from './Select'
import FieldError from './FieldError'
import validateThaiId from '../utils/validateThaiId'
import logo from '../assets/logo.svg'

// ช่องทางคำสั่งซื้อ
const channels = ['Shopee', 'Lazada', 'LINE', 'Facebook', 'เว็บไซต์', 'หน้าร้าน', 'อื่น ๆ']

export default function ETaxForm() {
  const [values, setValues] = useState({
    channel: '',
    referenceNo: '',
    personType: 'บุคคลธรรมดา',
    taxId: '',
    firstName: '',
    lastName: '',
    line1: '',
    street: '',
    subdistrict: '',
    district: '',
    province: '',
    postalCode: '',
    email: '',
    acceptedPolicy: false,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [provinceData, setProvinceData] = useState([])
  const [districts, setDistricts] = useState([])
  const [subdistricts, setSubdistricts] = useState([])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSuccess(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // โหลดข้อมูลจังหวัด/อำเภอ/ตำบลจากชุดข้อมูลภายนอก
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json'
    )
      .then((res) => res.json())
      .then((data) => setProvinceData(data))
      .catch((err) => console.error('ไม่สามารถโหลดข้อมูลที่อยู่', err))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleTaxIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 13)
    setValues((v) => ({ ...v, taxId: value }))
    if (value.length === 0) {
      setErrors((er) => ({ ...er, taxId: undefined }))
    } else if (value.length !== 13) {
      setErrors((er) => ({ ...er, taxId: 'ต้องมี 13 หลัก' }))
    } else if (!validateThaiId(value)) {
      setErrors((er) => ({ ...er, taxId: 'เลขประจำตัวไม่ถูกต้อง' }))
    } else {
      setErrors((er) => ({ ...er, taxId: undefined }))
    }
  }

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value
    const p = provinceData.find((prv) => prv.name_th === provinceName)
    setDistricts(p ? p.amphure : [])
    setSubdistricts([])
    setValues((v) => ({ ...v, province: provinceName, district: '', subdistrict: '', postalCode: '' }))
    setErrors((er) => ({ ...er, province: undefined, district: undefined, subdistrict: undefined }))
  }

  const handleDistrictChange = (e) => {
    const districtName = e.target.value
    const d = districts.find((dt) => dt.name_th === districtName)
    setSubdistricts(d ? d.tambon : [])
    setValues((v) => ({ ...v, district: districtName, subdistrict: '', postalCode: '' }))
    setErrors((er) => ({ ...er, district: undefined, subdistrict: undefined }))
  }

  const handleSubdistrictChange = (e) => {
    const subName = e.target.value
    const t = subdistricts.find((sb) => sb.name_th === subName)
    setValues((v) => ({ ...v, subdistrict: subName, postalCode: t ? t.zip_code : '' }))
    setErrors((er) => ({ ...er, subdistrict: undefined }))
  }

  const validate = () => {
    const newErrors = {}
    if (!values.channel) newErrors.channel = 'โปรดเลือกช่องทางคำสั่งซื้อ'
    if (!values.referenceNo) newErrors.referenceNo = 'โปรดกรอกเลขที่อ้างอิง'
    if (!values.taxId) newErrors.taxId = 'โปรดกรอกเลขประจำตัวผู้เสียภาษี'
    else if (!validateThaiId(values.taxId)) newErrors.taxId = 'เลขประจำตัวไม่ถูกต้อง'
    if (!values.firstName) newErrors.firstName = 'โปรดกรอกชื่อ'
    if (!values.lastName) newErrors.lastName = 'โปรดกรอกนามสกุล'
    if (!values.line1) newErrors.line1 = 'โปรดกรอกที่อยู่'
    if (!values.subdistrict) newErrors.subdistrict = 'โปรดเลือกตำบล/แขวง'
    if (!values.district) newErrors.district = 'โปรดเลือกอำเภอ/เขต'
    if (!values.province) newErrors.province = 'โปรดเลือกจังหวัด'
    if (!/^\d{5}$/.test(values.postalCode)) newErrors.postalCode = 'รหัสไปรษณีย์ไม่ถูกต้อง'
    if (!values.email) newErrors.email = 'โปรดกรอกอีเมล'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) newErrors.email = 'อีเมลไม่ถูกต้อง'
    if (!values.acceptedPolicy) newErrors.acceptedPolicy = 'จำเป็นต้องยอมรับนโยบาย'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      const firstField = Object.keys(newErrors)[0]
      const el = document.getElementById(firstField)
      if (el) el.focus()
      return
    }
    setSubmitting(true)
    const payload = {
      channel: values.channel,
      referenceNo: values.referenceNo,
      personType: values.personType,
      taxId: values.taxId,

      firstName: values.firstName,
      lastName: values.lastName,
      address: {
        line1: values.line1,
        street: values.street,
        subdistrict: values.subdistrict,
        district: values.district,
        province: values.province,
        postalCode: values.postalCode,
      },
      email: values.email,
      acceptedPolicy: values.acceptedPolicy,
      submittedAt: new Date().toISOString(),
    }
    console.log(payload)
    // TODO: Replace console.log with real submit API integration
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
    }, 500)
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-6 relative"
    >
      <div className="flex items-start space-x-3">
        {/* TODO: Replace placeholder logo with official image */}
        <img src={logo} alt="Food Promart" className="h-10 w-10" />
        <div>
          <h1 className="text-2xl font-semibold">Food Promart คำร้องขอใบกำกับภาษีอิเล็กทรอนิกส์</h1>
          <a href="#" className="text-sm text-gray-500 hover:underline">
            ต้องการติดต่อฝ่ายบริการลูกค้า?
          </a>
        </div>
      </div>

      <Select
        id="channel"
        name="channel"
        label="ช่องทางคำสั่งซื้อ"
        required
        options={channels}
        placeholder="— เลือกช่องทาง —"
        value={values.channel}
        onChange={handleChange}
        error={errors.channel}
      />

      <Input
        id="referenceNo"
        name="referenceNo"
        label="เลขที่อ้างอิง"
        required
        placeholder="กรอกเลขที่อ้างอิงคำสั่งซื้อ"
        value={values.referenceNo}
        onChange={handleChange}
        error={errors.referenceNo}
      />

      <div>
        <span className="block text-sm font-medium text-gray-700">ประเภทบุคคล</span>
        <div className="mt-2 space-y-1">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="personType"
              value="บุคคลธรรมดา"
              checked={values.personType === 'บุคคลธรรมดา'}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2">บุคคลธรรมดา</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              name="personType"
              value="นิติบุคคล"
              checked={values.personType === 'นิติบุคคล'}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2">นิติบุคคล</span>
          </label>
        </div>
      </div>

      <Input
        id="taxId"
        name="taxId"
        label="เลขประจำตัวผู้เสียภาษี"
        required
        value={values.taxId}
        onChange={handleTaxIdChange}
        error={errors.taxId}
        inputMode="numeric"
        pattern="\d*"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          id="firstName"
          name="firstName"
          label="ชื่อ"
          required
          value={values.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Input
          id="lastName"
          name="lastName"
          label="นามสกุล"
          required
          value={values.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
      </div>

      <Input
        id="line1"
        name="line1"
        label="บ้านเลขที่ / อาคาร / หมู่บ้าน"
        required
        value={values.line1}
        onChange={handleChange}
        error={errors.line1}
      />

      <Input
        id="street"
        name="street"
        label="ถนน / ซอย"
        value={values.street}
        onChange={handleChange}
        error={errors.street}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Select
          id="district"
          name="district"
          label="อำเภอ / เขต"
          required
          options={districts.map((d) => d.name_th)}
          placeholder="— เลือกอำเภอ —"
          value={values.district}
          onChange={handleDistrictChange}
          error={errors.district}
        />
        <Select
          id="subdistrict"
          name="subdistrict"
          label="ตำบล / แขวง"
          required
          options={subdistricts.map((t) => t.name_th)}
          placeholder="— เลือกตำบล —"
          value={values.subdistrict}
          onChange={handleSubdistrictChange}
          error={errors.subdistrict}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Select
          id="province"
          name="province"
          label="จังหวัด"
          required
          options={provinceData.map((p) => p.name_th)}
          placeholder="— เลือกจังหวัด —"
          value={values.province}
          onChange={handleProvinceChange}
          error={errors.province}
        />
        <Input
          id="postalCode"
          name="postalCode"
          label="รหัสไปรษณีย์"
          required
          value={values.postalCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 5)
            setValues((v) => ({ ...v, postalCode: value }))
          }}
          error={errors.postalCode}
          inputMode="numeric"
          pattern="\d*"
        />
      </div>

      <Input
        id="email"
        name="email"
        type="email"
        label="อีเมล"
        required
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="กรอกอีเมล"
      />

      <div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptedPolicy"
              name="acceptedPolicy"
              type="checkbox"
              className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${errors.acceptedPolicy ? 'border-red-500 focus:ring-red-500' : ''}`}
              checked={values.acceptedPolicy}
              onChange={handleChange}
              aria-invalid={errors.acceptedPolicy ? 'true' : 'false'}
              aria-describedby={errors.acceptedPolicy ? 'acceptedPolicy-error' : undefined}
              required
            />
          </div>
          <label htmlFor="acceptedPolicy" className="ml-2 block text-sm text-gray-700">
            ข้าพเจ้ายืนยันว่าข้อมูลข้างต้นถูกต้องและยอมรับนโยบายความเป็นส่วนตัว
          </label>
        </div>
        {errors.acceptedPolicy && (
          <FieldError id="acceptedPolicy-error">{errors.acceptedPolicy}</FieldError>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 h-12 bg-primary text-white rounded-lg hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={submitting}
      >
        {submitting ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span>ส่งคำร้อง</span>
      </button>

      {success && (
        <div className="text-sm text-green-600" role="status">
          ส่งคำร้องเรียบร้อย (ตัวอย่าง) – ระบบยังไม่เชื่อมต่อ
        </div>
      )}
    </form>
  )
}
