import React from 'react'

export default function FieldError({ id, children }) {
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {children}
    </p>
  )
}
