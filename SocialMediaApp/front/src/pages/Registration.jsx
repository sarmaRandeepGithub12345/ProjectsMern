import React, { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from "react-router-dom";
import CssTextField from 'components/CssTextField';
//import { useRegisterUserMutation } from 'counter/userAuthApi';
import { registerUser } from 'api/userAuth.js';
import { useMediaQuery } from '@mui/material'
import { uploadFile } from 'utils/newRequest';
import "./Login.scss"
import {storage} from "../firebase.js"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Registration = ({ userData, update }) => {
  const [error, setError] = useState({
    msg: '',
    status: 'false',
    color: 'red'
  })

  //Reference for form element
  const formRef = useRef(null)
  //console.log(userData)
  const [firstname, setfirstName] = useState(update === "update" ? userData?.firstname : '');
  const [lastname, setlastName] = useState(update === "update" ? userData?.lastname : '');
  const [location, setlocation] = useState(update === "update" ? userData?.location : '');
  const [occupation, setoccupation] = useState(update === "update" ? userData?.occupation : '');
  const [picvalue, setPicValue] = useState(update === "update" ? userData?.imageUrl : '')
  const [email, setemail] = useState(update === "update" ? userData?.email : '');
  const [password, setpassword] = useState();
  //console.log(picvalue)
  //Function for dropzone image on dropping the image
  const onDrop = (acceptedFiles) => {
    setPicValue(acceptedFiles[0])
    // console.log(acceptedFiles[0].path)
  }
  const navigate = useNavigate()
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })
  //const [registerUser] =  useRegisterUserMutation()



  const upload = (items)=>{
    //console.log(items)
    items.forEach((item)=>{
      const filename = new Date().getTime() + item.label + item.file.name;
      const storageRef = ref(storage,`/Social_Media_dp/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef,item.file);
      uploadTask.on("state_changed",snapshot=>{
         const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
         console.log("Upload is "+progress+"% done") 
      },(err)=>{console.log(err)},()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(async(url)=>{
    const data = new FormData();
 
    if (firstname && lastname && location && email && password && picvalue) {
      data.append('firstname', firstname)
      data.append('lastname', lastname)
      data.append('occupation', occupation)
      data.append('location', location)
      data.append('email', email)
      data.append('password', password)
      data.append('imageUrl', url)

      const response = await registerUser(data)
      //console.log(response)
      if (response.data.status === 'success') {
        setError({ msg: response.data.message, status: true, color: '#4feb34' })
        formRef.current.reset();
        setTimeout(() => {
          navigate('/')
        }, 3000);

      } else {
        setError({ msg: response.data.message, status: true })
      }

    } else {
      setError({ msg: "All fields are required", status: true })
    }         

          
        })
      });
    }) 
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    upload([{file:picvalue,label:"dp"}])


  }

  //for error state
  useEffect(() => {
    setTimeout(() => {
      setError({ msg: '', status: false, color: 'red' })
    }, 2000);
  }, [error.status])
  const isNonMobileScreens = useMediaQuery("(min-width:600px)")

  return (
    <>
      <div className={`flex flex-col h-screen w-full justify-center items-center login`} >
        <form className={`${!isNonMobileScreens?"w-[300px]":"w-[55vw]"}  flex justify-center items-center flex-col  box-border  h-[100vh]  rounded-2xl  mt-[1rem]`} onSubmit={handleSubmit} ref={formRef}>
          <CssTextField
            id="outlined-firstname-input"
            label="First Name"
            type="text"
            name="firstname"
            onChange={e => setfirstName(e.target.value)}
            sx={{
              mx: 'auto',
              mt: 2,

              borderRadius: "0.35rem",
              width: '80%'
            }}
            defaultValue={firstname}
            size="small"
            required
            className="bg-[#fafafa] shadow-[5px_5px_5px_3px_rgba(0,0,0,0.3)]"
          />
          <CssTextField
            id="outlined-lastname-input"
            label="Last Name"
            type="text"
            onChange={e => setlastName(e.target.value)}
            defaultValue={lastname}
            name="lastname"
            size="small"
            sx={{
              mx: 'auto',
              mt: 2,
              borderRadius: "0.35rem",
              width: '80%'
            }}
            required
            className="bg-[#fafafa] shadow-[5px_5px_5px_3px_rgba(0,0,0,0.3)]"
          />
          <CssTextField
            id="outlined-location-input"
            label="Location"
            type="text"
            name="location"
            size='small'
            onChange={e => setlocation(e.target.value)}
            defaultValue={location}
            sx={{
              mx: 'auto',
              mt: 2,
              borderRadius: "0.35rem",
              width: '80%'
            }}
            required
            className="bg-[#fafafa] shadow-[5px_5px_5px_3px_rgba(0,0,0,0.3)]"
          />
          <CssTextField
            id="outlined-occupation-input"
            label="Occupation"
            type="text"
            name="occupation"
            onChange={e => setoccupation(e.target.value)}
            defaultValue={occupation}
            size='small'
            sx={{
              mx: 'auto',
              mt: 2,
              borderRadius: "0.35rem",
              width: '80%'
            }}
            required
            className="bg-[#fafafa] shadow-[5px_5px_5px_3px_rgba(0,0,0,0.3)]"
          />


          <div {...getRootProps()} className={`dropzone-container border-[1px] border-[grey] h-10 mt-4 rounded-[0.35rem] w-[80%] shadow-[5px_5px_5px_3px_rgba(0,0,0,0.3)] flex justify-center items-center bg-[white]`}>
            <input {...getInputProps()} name="photo" />
            {
              !picvalue ?
                <p>Add a picture</p>
                : (
                  <p>{picvalue?.path?.slice(0, 10)}...jpg</p>
                )
            }
          </div>
          <CssTextField
            id="outlined-email-input"
            label="Email"
            type="email"
            name="email"
            autoComplete="current-password"
            onChange={e => setemail(e.target.value)}
            defaultValue={email}
            size='small'
            sx={{
              mx: 'auto',
              mt: 2,
              borderRadius: "0.35rem",
              width: '80%'
            }}
            required
            className="bg-[#fafafa] shadow-[5px_5px_5px_3px_rgba(0,0,0,0.3)]"
          />
          <CssTextField
            id="outlined-password-input"
            label="Password"
            type="password"
            name="password"
            size='small'
            required
            onChange={e => setpassword(e.target.value)}

            sx={{

              mx: 'auto',
              mt: 2,
              borderRadius: "0.35rem",
              width: '80%',

            }}

            className={`bg-[white] shadow-[5px_5px_5px_3px_rgba(0,0,0,0.3)] `}
          />
          <div className="w-[80%] h-[8vh] shadow-[5px_5px_5px_3px_rgba(0,0,0,0.3)] mt-8">
            <input type="submit" value={update === "update" ? "Update" : "Register"} className="bg-[#03fcdf] cursor-pointer  box-border w-full h-full rounded-[0.35rem] text-[1.5rem] text-[#2d2d2d] " />
          </div>
          {update === "update" ? <></> :
            <div className="mt-[1.5rem]"><a href="/" className="text-[12px] flex justify-center hover:underline  text-[white]">Already have an account?Click Here</a>
            </div>}
          <p className={`${error.color === '' ? "text-[red]" : "text-[#00a339e1]"} text-[0.9rem]`}>{error.status ? error.msg : ""}</p>
        </form>
      </div>

    </>
  )
}

export default Registration