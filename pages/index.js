import Image from 'next/image'
import styles from '../styles/Home.module.css'
import HCLogo from '../assets/HackerChain.png'
import {  BsGithub, BsTwitter, BsFacebook, BsGoogle} from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

const providers = ['discord','twitter', 'github', 'facebook', 'google'];

const logos = {
  'discord':<FaDiscord/>,
  'twitter':<BsTwitter/>,
  'github':<BsGithub/>,
  'facebook':<BsFacebook/>,
  'google':<BsGoogle/>
};

export default function Home() {
 
  return (
    <div style={{marginTop:'25vh'}}>
      
      <div style={{ width:'70%', marginLeft:'auto', marginRight:'auto'}}>
      <Image src={HCLogo}/>
      </div>

      <div style={{textAlign:'center', marginTop:'5vh'}}>
      <p style={{color:'white', fontSize:'10px'}}> A verification keychain built for the Lukso Universal Profile </p>
      </div>

      <div style={{marginTop:'40vh', marginBottom:'40vh', textAlign:'center'}}> 
        <h3 style={{color:'white', marginBottom:'10vh'}}> Link your Web2 Profiles to your Decentralized Identity </h3>
        <div style={{color:'rgb(100,248,55)'}}>
        {
          providers.map(arg=>{
            return (
              <div style={{padding:'40px 40px ', display:'inline-block', transform:'scale(3)'}}>
             {logos[arg]}
             </div>
            )
          })
        }
        </div>
        <h3 style={{color:'white', marginTop:'10vh'}}>  Gain Credibility when Applying to Web3 Jobs  </h3>
      </div>

      <div style={{marginTop:'40vh', marginBottom:'20vh', textAlign:'center', color:'rgb(100,248,55)'}}>

        <h3 style={{color:'white', marginBottom:'10vh'}}> Showcase as a keychain on your Universal Profile </h3>
        <div style={{textAlign:'left', marginLeft:'3vw'}}>
          <h1 > {'{'} </h1>
        </div>

        <div style={{width:'70%', marginLeft:'auto', marginRight:'auto', overflowX:'auto', textAlign:'left'}}>
          <h2> {'Name: HackerChain'} </h2>
          <h2>{'Key: 0x848fdbef8fd8e0facfb5417e82d1232b553e547d7f74b3e968fde9e287e76baf'} </h2>
          <h2> {'Authentications: '}</h2>
          <h2> {'.'}</h2>
          <h2> {'.'}</h2>
        </div>

        <div style={{textAlign:'right', marginRight:'3vw'}}>
          <h1 > {'}'} </h1>
        </div>

      </div>

    </div>
  )
}
