import React from 'react'
import FieldError from './FieldError'

export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  required,
  placeholder,
  error,
}) {
  const selectClasses = `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`
  const describedBy = error ? `${id}-error` : undefined
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={selectClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}
