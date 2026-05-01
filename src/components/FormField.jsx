function FormField({ label, error, children }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-gray-200">
      <span className="font-medium">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-400">{error}</span> : null}
    </label>
  )
}

export default FormField
