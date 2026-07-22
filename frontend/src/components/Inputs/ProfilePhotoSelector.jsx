import { useRef, useState } from 'react'
import { LuUpload, LuTrash, LuUser } from 'react-icons/lu'

const ProfilePhotoSelector = ({ preview, setPreview, image, setImage }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const nextPreview = URL.createObjectURL(file)
      if (setPreview) {
        setPreview(nextPreview)
      }
      setPreviewUrl(nextPreview)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreviewUrl(null)
    if (setPreview) setPreview(null)
  }

  const onChooseFile = () => {
    inputRef.current?.click()
  }

  return (
    <div className="mb-4 flex justify-center">
      <input type="file" accept="image/*" ref={inputRef} onChange={handleImageChange} className="hidden" />
      {!image ? (
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-orange-200 bg-orange-50 shadow-sm">
          <LuUser className="text-4xl text-orange-500" />
          <button type="button" onClick={onChooseFile} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg">
            <LuUpload size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={preview || previewUrl} alt="profile photo" className="h-24 w-24 rounded-full object-cover shadow-sm" />
          <button type="button" onClick={handleRemoveImage} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
            <LuTrash size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector
