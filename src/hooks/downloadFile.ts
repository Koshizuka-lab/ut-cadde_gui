export const downloadFile = (blob: Blob, filename: string) => {
  const url: string = URL.createObjectURL(blob)
  const a: HTMLAnchorElement = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
};
