import { useMediaQuery } from '@mui/material'
import React from 'react'
import AdWidget from './extraschild/AdWidget'
import FriendList from './extraschild/FriendList'




const Extras = ({ profile, userData }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <div className={` ${isNonMobileScreens ? "box-border w-full flex flex-col items-start" : "box-border w-full flex flex-col items-center"} `}>

      {profile ? <></> : <>{isNonMobileScreens ? <AdWidget /> : <></>}</>}


      <FriendList profileData={userData} />

    </div>
  )
}

export default Extras