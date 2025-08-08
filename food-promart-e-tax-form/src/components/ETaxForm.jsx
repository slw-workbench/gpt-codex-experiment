import React, { useState, useEffect } from 'react'
import Input from './Input'
import Select from './Select'
import FieldError from './FieldError'
import validateThaiId from '../utils/validateThaiId'
import logo from '../assets/logo.svg'

// ช่องทางคำสั่งซื้อ
const channels = {
  th: ['Shopee', 'Lazada', 'LINE', 'Facebook', 'เว็บไซต์', 'หน้าร้าน', 'อื่น ๆ'],
  en: ['Shopee', 'Lazada', 'LINE', 'Facebook', 'Website', 'Storefront', 'Other'],
}

const texts = {
  th: {
    title: 'Food Promart คำร้องขอใบกำกับภาษีอิเล็กทรอนิกส์',
    contact: 'ต้องการติดต่อฝ่ายบริการลูกค้า?',
    channelLabel: 'ช่องทางคำสั่งซื้อ',
    channelPlaceholder: '— เลือกช่องทาง —',
    referenceNoLabel: 'เลขที่อ้างอิง',
    referencePlaceholder: 'กรอกเลขที่อ้างอิงคำสั่งซื้อ',
    personTypeLabel: 'ประเภทบุคคล',
    personTypeOptions: { individual: 'บุคคลธรรมดา', corporate: 'นิติบุคคล' },
    taxIdLabel: 'เลขประจำตัวผู้เสียภาษี',
    firstNameLabel: 'ชื่อ',
    lastNameLabel: 'นามสกุล',
    line1Label: 'บ้านเลขที่ / อาคาร / หมู่บ้าน',
    streetLabel: 'ถนน / ซอย',
    districtLabel: 'อำเภอ / เขต',
    subdistrictLabel: 'ตำบล / แขวง',
    provinceLabel: 'จังหวัด',
    provincePlaceholder: '— เลือกจังหวัด —',
    districtPlaceholder: '— เลือกอำเภอ —',
    subdistrictPlaceholder: '— เลือกตำบล —',
    postalCodeLabel: 'รหัสไปรษณีย์',
    emailLabel: 'อีเมล',
    emailPlaceholder: 'กรอกอีเมล',
    policyText:
      'ข้าพเจ้ายืนยันว่าข้อมูลข้างต้นถูกต้องและยอมรับนโยบายความเป็นส่วนตัว',
    submit: 'ส่งคำร้อง',
    success: 'ส่งคำร้องเรียบร้อย (ตัวอย่าง) – ระบบยังไม่เชื่อมต่อ',
    errors: {
      channel: 'โปรดเลือกช่องทางคำสั่งซื้อ',
      referenceNo: 'โปรดกรอกเลขที่อ้างอิง',
      taxIdRequired: 'โปรดกรอกเลขประจำตัวผู้เสียภาษี',
      taxIdLength: 'ต้องมี 13 หลัก',
      taxIdInvalid: 'เลขประจำตัวไม่ถูกต้อง',
      firstName: 'โปรดกรอกชื่อ',
      lastName: 'โปรดกรอกนามสกุล',
      line1: 'โปรดกรอกที่อยู่',
      subdistrict: 'โปรดเลือกตำบล/แขวง',
      district: 'โปรดเลือกอำเภอ/เขต',
      province: 'โปรดเลือกจังหวัด',
      postalCode: 'รหัสไปรษณีย์ไม่ถูกต้อง',
      emailRequired: 'โปรดกรอกอีเมล',
      emailInvalid: 'อีเมลไม่ถูกต้อง',
      policy: 'จำเป็นต้องยอมรับนโยบาย',
    },
  },
  en: {
    title: 'Food Promart E-Tax Invoice Request',
    contact: 'Need to contact customer service?',
    channelLabel: 'Order channel',
    channelPlaceholder: '— Select channel —',
    referenceNoLabel: 'Reference number',
    referencePlaceholder: 'Enter order reference',
    personTypeLabel: 'Customer type',
    personTypeOptions: { individual: 'Individual', corporate: 'Corporate' },
    taxIdLabel: 'Tax ID',
    firstNameLabel: 'First name',
    lastNameLabel: 'Last name',
    line1Label: 'Address line 1',
    streetLabel: 'Street / Lane',
    districtLabel: 'District',
    subdistrictLabel: 'Subdistrict',
    provinceLabel: 'Province',
    provincePlaceholder: '— Select province —',
    districtPlaceholder: '— Select district —',
    subdistrictPlaceholder: '— Select subdistrict —',
    postalCodeLabel: 'Postal code',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter email',
    policyText:
      'I confirm the above information is correct and accept the privacy policy',
    submit: 'Submit request',
    success: 'Request submitted (demo) – system not connected',
    errors: {
      channel: 'Please select order channel',
      referenceNo: 'Please enter reference number',
      taxIdRequired: 'Please enter Tax ID',
      taxIdLength: 'Must be 13 digits',
      taxIdInvalid: 'Invalid Tax ID',
      firstName: 'Please enter first name',
      lastName: 'Please enter last name',
      line1: 'Please enter address',
      subdistrict: 'Please select subdistrict',
      district: 'Please select district',
      province: 'Please select province',
      postalCode: 'Invalid postal code',
      emailRequired: 'Please enter email',
      emailInvalid: 'Invalid email',
      policy: 'You must accept the policy',
    },
  },
}

export default function ETaxForm() {
  const [lang, setLang] = useState('th')
  const [values, setValues] = useState({
    channel: '',
    referenceNo: '',
    personType: 'individual',
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
  const t = texts[lang]

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSuccess(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.title
  }, [lang, t.title])

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
      setErrors((er) => ({ ...er, taxId: t.errors.taxIdLength }))
    } else if (!validateThaiId(value)) {
      setErrors((er) => ({ ...er, taxId: t.errors.taxIdInvalid }))
    } else {
      setErrors((er) => ({ ...er, taxId: undefined }))
    }
  }

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value
    const p = provinceData.find((prv) => String(prv.id) === provinceId)
    setDistricts(p ? p.amphure : [])
    setSubdistricts([])
    setValues((v) => ({ ...v, province: provinceId, district: '', subdistrict: '', postalCode: '' }))
    setErrors((er) => ({ ...er, province: undefined, district: undefined, subdistrict: undefined }))
  }

  const handleDistrictChange = (e) => {
    const districtId = e.target.value
    const d = districts.find((dt) => String(dt.id) === districtId)
    setSubdistricts(d ? d.tambon : [])
    setValues((v) => ({ ...v, district: districtId, subdistrict: '', postalCode: '' }))
    setErrors((er) => ({ ...er, district: undefined, subdistrict: undefined }))
  }

  const handleSubdistrictChange = (e) => {
    const subId = e.target.value
    const tambon = subdistricts.find((sb) => String(sb.id) === subId)
    setValues((v) => ({ ...v, subdistrict: subId, postalCode: tambon ? tambon.zip_code : '' }))
    setErrors((er) => ({ ...er, subdistrict: undefined }))
  }

  const validate = () => {
    const newErrors = {}
    if (!values.channel) newErrors.channel = t.errors.channel
    if (!values.referenceNo) newErrors.referenceNo = t.errors.referenceNo
    if (!values.taxId) newErrors.taxId = t.errors.taxIdRequired
    else if (values.taxId.length !== 13 || !validateThaiId(values.taxId))
      newErrors.taxId = t.errors.taxIdInvalid
    if (!values.firstName) newErrors.firstName = t.errors.firstName
    if (!values.lastName) newErrors.lastName = t.errors.lastName
    if (!values.line1) newErrors.line1 = t.errors.line1
    if (!values.subdistrict) newErrors.subdistrict = t.errors.subdistrict
    if (!values.district) newErrors.district = t.errors.district
    if (!values.province) newErrors.province = t.errors.province
    if (!/^\d{5}$/.test(values.postalCode)) newErrors.postalCode = t.errors.postalCode
    if (!values.email) newErrors.email = t.errors.emailRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = t.errors.emailInvalid
    if (!values.acceptedPolicy) newErrors.acceptedPolicy = t.errors.policy
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
    const langKey = lang === 'th' ? 'name_th' : 'name_en'
    const provinceObj = provinceData.find((p) => String(p.id) === values.province)
    const districtObj = districts.find((d) => String(d.id) === values.district)
    const subdistrictObj = subdistricts.find((s) => String(s.id) === values.subdistrict)
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
        subdistrict: subdistrictObj ? subdistrictObj[langKey] : '',
        district: districtObj ? districtObj[langKey] : '',
        province: provinceObj ? provinceObj[langKey] : '',
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
      className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 relative"
    >
      <button
        type="button"
        onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
        className="absolute top-4 right-4 text-xl"
        aria-label={lang === 'th' ? 'English' : 'ไทย'}
      >
        {lang === 'th' ? '🇬🇧' : '🇹🇭'}
      </button>
      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          {/* TODO: Replace placeholder logo with official image */}
          <img src={logo} alt="Food Promart" className="h-10 w-10" />
          <div>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <a href="#" className="text-sm text-gray-500 hover:underline">
              {t.contact}
            </a>
          </div>
        </div>

        <Select
          id="channel"
          name="channel"
          label={t.channelLabel}
          required
          options={channels[lang]}
          placeholder={t.channelPlaceholder}
          value={values.channel}
          onChange={handleChange}
          error={errors.channel}
        />

        <Input
          id="referenceNo"
          name="referenceNo"
          label={t.referenceNoLabel}
          required
          placeholder={t.referencePlaceholder}
          value={values.referenceNo}
          onChange={handleChange}
          error={errors.referenceNo}
        />

        <div>
          <span className="block text-sm font-medium text-gray-700">{t.personTypeLabel}</span>
          <div className="mt-2 space-y-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="personType"
                value="individual"
                checked={values.personType === 'individual'}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2">{t.personTypeOptions.individual}</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                name="personType"
                value="corporate"
                checked={values.personType === 'corporate'}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2">{t.personTypeOptions.corporate}</span>
            </label>
          </div>
        </div>

        <Input
          id="taxId"
          name="taxId"
          label={t.taxIdLabel}
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
            label={t.firstNameLabel}
            required
            value={values.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Input
            id="lastName"
            name="lastName"
            label={t.lastNameLabel}
            required
            value={values.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <Input
          id="line1"
          name="line1"
          label={t.line1Label}
          required
          value={values.line1}
          onChange={handleChange}
          error={errors.line1}
        />

        <Input
          id="street"
          name="street"
          label={t.streetLabel}
          value={values.street}
          onChange={handleChange}
          error={errors.street}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Select
            id="district"
            name="district"
            label={t.districtLabel}
            required
            options={districts.map((d) => ({
              value: d.id,
              label: d[lang === 'th' ? 'name_th' : 'name_en'],
            }))}
            placeholder={t.districtPlaceholder}
            value={values.district}
            onChange={handleDistrictChange}
            error={errors.district}
          />
          <Select
            id="subdistrict"
            name="subdistrict"
            label={t.subdistrictLabel}
            required
            options={subdistricts.map((sb) => ({
              value: sb.id,
              label: sb[lang === 'th' ? 'name_th' : 'name_en'],
            }))}
            placeholder={t.subdistrictPlaceholder}
            value={values.subdistrict}
            onChange={handleSubdistrictChange}
            error={errors.subdistrict}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Select
            id="province"
            name="province"
            label={t.provinceLabel}
            required
            options={provinceData.map((p) => ({
              value: p.id,
              label: p[lang === 'th' ? 'name_th' : 'name_en'],
            }))}
            placeholder={t.provincePlaceholder}
            value={values.province}
            onChange={handleProvinceChange}
            error={errors.province}
          />
          <Input
            id="postalCode"
            name="postalCode"
            label={t.postalCodeLabel}
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
          label={t.emailLabel}
          required
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder={t.emailPlaceholder}
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
              {t.policyText}
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
          <span>{t.submit}</span>
        </button>

        {success && (
          <div className="text-sm text-green-600" role="status">
            {t.success}
          </div>
        )}
      </div>
    </form>
  )
}
