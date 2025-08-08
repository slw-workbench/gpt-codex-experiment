import React from 'react'
import FieldError from './FieldError'

export default function Input({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
  error,
  ...props
}) {
  const inputClasses = `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`
  const describedBy = error ? `${id}-error` : undefined
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...props}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}
