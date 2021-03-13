import React from 'react'
import { useFileUpload } from 'use-file-upload'

const Upload = () => {
  const [file, selectFile] = useFileUpload()

  return (
    <div>
      <button
        onClick={() => {
          // Single File Upload
          selectFile()
        }}
      >
        Click to Upload
      </button>

      {file ? (
        <div>
          <img src={file.source} alt='preview' />
          <span> Name: {file.name} </span>
          <span> Size: {file.size} </span>
        </div>
      ) : (
        <span>No file selected</span>
      )}
    </div>
  )
}

export default Upload