export const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString()
}

export const formatDateTime = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

export const truncateText = (value, max = 80) => {
  if (!value) return '-'
  return value.length > max ? `${value.slice(0, max)}...` : value
}
