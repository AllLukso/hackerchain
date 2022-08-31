import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineAppstore } from "react-icons/ai";
import {useEffect, useState} from 'react'
import HCLogo from '../assets/HackerChain.png'

const buttonStyle1 = {
  marginBottom:'3vh', 
  backgroundColor:'black',
  color:'white',
  border:'3px double rgb(100,248,55)',
  height:'30px'
  
}

function TopComponent(){

  const router = useRouter()

  const[screenSize, setScreenSize] = useState('')
  const[modal, setModal] = useState('')

  useEffect(()=>{
    setScreenSize( window.innerWidth)
    window.addEventListener("resize", (event) => {
      setScreenSize( window.innerWidth)
    });
  },[])

  useEffect(()=>{
   console.log(router.pathname)
  },[router.pathname])


  function displayModal(){
    return(
        <dialog 
        style={{width:'50%', height:'45vh', marginTop:'10vh', border:'1px solid rgb(100,248,55)', backgroundColor:'black', zIndex:'1'}}
        open
        >
            <div style={{textAlign:'right'}}>
                <button 
                style={{color:'rgb(100,248,55)', border:'0px', backgroundColor:'transparent', transform:'scale(1.5)', cursor:'pointer'}}
                onClick={()=>setModal(false)}
                >
                    x
                </button>
                <div style={{display:'grid', gridTemplateRows:'auto auto auto', textAlign:'center', marginTop:'10vh'}}>
                  <Link href="/register">
                  <button  onClick={()=>setModal(false)} style={buttonStyle1}> Register </button>
                  </Link>
                  <Link href="/verify">
                  <button  onClick={()=>setModal(false)} style={buttonStyle1}>  Verify </button>
                  </Link>
                  <Link href="/">
                  <button  onClick={()=>setModal(false)} style={buttonStyle1}> About </button>
                  </Link>
                </div>
            </div>
        </dialog>
    )
  }

  return(

    <>
    <Head>
        <title>HackerChain</title>
        <meta name="description" content="A Verification Keychain for Hackers" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div  style={{color: 'rgb(100,248,55)',
    padding:' 0px 10px',
    display:'grid',
    gridTemplateColumns: 'auto auto',
    alignItems:'center'}}>
                
     
      {
        screenSize > 600 ?
        <>
          { router.pathname !== '/' ?
            <div style={{width:'50%', marginTop:'2vh'}}>
            <Image src={HCLogo}/>
            </div>
            :
            <div style={{width:'50%', marginTop:'2vh'}}>
            
            </div>
          }

          <div style={{textAlign:'right', marginTop:'3vh'}}>
            <Link href="/register">
            <button style={{marginBottom:'3vh', cursor:'pointer', backgroundColor:'black', color:'rgb(100,248,55)', border:'0px'}}> Register </button>
            </Link>
            <Link href="/verify">
            <button style={{marginBottom:'3vh', cursor:'pointer', backgroundColor:'black', color:'rgb(100,248,55)', border:'0px', marginLeft:'3vw'}}> Verify </button>
            </Link>
            <Link href="/">
            <button style={{marginBottom:'3vh', cursor:'pointer', backgroundColor:'black', color:'rgb(100,248,55)', border:'0px', marginLeft:'3vw'}}> About </button>
            </Link>
          </div>
        </>
        :
        <>
          {
            router.pathname !== '/' ?
            <div style={{width:'60%', marginTop:'2vh'}}>
            <Image src={HCLogo}/>
            </div>
            :
            <div style={{width:'60%', marginTop:'2vh'}}>
           
            </div>
          }
          
          <div style={router.pathname !== '/' ? {textAlign:'right', color:'rgb(100,248,55)'} : {textAlign:'right', color:'rgb(100,248,55)', marginTop:'5vh'}}>
            <button 
              style={{
                transform:'scale(2.5)', 
                backgroundColor:'black', 
                color:'rgb(100,248,55)', 
                border:'0px', 
                cursor:'pointer'
              }}
              onClick={()=>setModal(true)}
              >
                <AiOutlineAppstore/>
              </button>
              {
                modal == true ?
                displayModal()
                :
                null
              }
          </div>
        </>
      }
      </div>
      </>
  )
}
export default TopComponent;
