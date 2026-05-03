import { useState } from 'react'
import axios from 'axios'

function App() {
  const [video, setVideo] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const uploadVideo = async () => {
    const formData = new FormData()

    formData.append('video', video)
    formData.append('title', title)
    formData.append('description', description)

    const res = await axios.post(
      'http://localhost:5000/upload',
      formData
    )

    alert('Upload sukses: ' + res.data.url)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>YouTube Upload App</h1>

      <input
        type="text"
        placeholder="Judul"
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Deskripsi"
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadVideo}>
        Upload ke YouTube
      </button>
    </div>
  )
}

export default App
