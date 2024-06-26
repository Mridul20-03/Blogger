import { Button, FileInput, Select, TextInput , Alert } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);

    const Navigate = useNavigate();
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image.");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Failed to upload the image");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (err) {
      setImageUploadError("Failed to upload the image");
      setImageUploadProgress(null);
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(!res.ok){
                setPublishError(data.message);
                return;
            }
          
            if(res.ok){
                setPublishError(null);
                Navigate(`/post/${data.slug}`);
            }
            
          } catch (err) {
            setPublishError('Something went wrong');
        }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setFormData( { ...formData, title : e.target.value })}
          />
          <Select 
           onChange={(e) => setFormData( { ...formData, category : e.target.value })}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react-js">React.js</option>
            <option value="next-js">Next.js</option>
            <option value="django">Django</option>
            <option value="webdevelopment">Web Development</option>
            <option value="nodejs">Node.js</option>
            <option value="ai">AI</option>
            <option value="android">Android</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-400 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {imageUploadError && (
          <Alert color="failure">{imageUploadError}</Alert>
        )}

        { formData.image && (
            <img src={formData.image}
            alt='upload'
            className="w-full h-72 object-cover" />
        )}

        <ReactQuill
          theme="snow"
          required
          placeholder="Write Something..."
          className="h-72 mb-12 "
          onChange={(value) => setFormData( { ...formData, content : value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>

        {
            publishError && <Alert color='failure' className="mt-5">{publishError}</Alert>
        }

      </form>
    </div>
  );
};

export default CreatePost;
