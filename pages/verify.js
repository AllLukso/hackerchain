import {useState, useEffect} from 'react'
import { ERC725 } from '@erc725/erc725.js';
import Web3 from 'web3'
import {  BsGithub, BsTwitter, BsFacebook, BsGoogle, BsPersonCircle} from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

const providers = ['github', 'twitter', 'discord', 'facebook', 'google'];

const logos = {
    'github':<BsGithub/>,
    'twitter':<BsTwitter/>,
    'discord':<FaDiscord/>,
    'facebook':<BsFacebook/>,
    'google':<BsGoogle/>
  };

const SCHEMA = [
    {
        name: 'LSP3Profile',
        key: '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
        keyType: 'Singleton',
        valueType: 'bytes',
        valueContent: 'JSONURL',
    },
    {
        name: 'HackerChain',
        key: '0x848fdbef8fd8e0facfb5417e82d1232b553e547d7f74b3e968fde9e287e76baf',
        keyType: 'Singleton',
        valueType: 'bytes',
        valueContent: 'JSONURL',
    }
];

async function fetchProfile(address) {
    const RPC_ENDPOINT = 'https://rpc.l16.lukso.network';
    const IPFS_GATEWAY = 'https://2eff.lukso.dev/ipfs/';
    // Parameters for ERC725 Instance
    const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
    const config = { ipfsGateway: IPFS_GATEWAY };
    try {
      const profile = new ERC725(SCHEMA, address, provider, config);
      return await profile.fetchData();
    } catch (error) {
      return console.log('Not a Valid Profile');
    }
  }


export default function Verify(){

    const[query, setQuery] = useState('')
    const[hackerInfo, setHackerInfo] = useState(null)
    const[upInfo, setUPInfo] = useState({})
    const[infoModal, setInfoModal] = useState('')

    // name used for authentication is stored as [(provider, name), (provider, name) . . . ]
    function getAuthInfo(arg){
        let x = hackerInfo.indexOf(arg)
        return (
        <>
        <p> {'Platform: ' + arg }</p>
        <p> {'Account: ' + hackerInfo[x+1]} </p>
        </>
        )
    }

    function handleSearchInput(event) {
        setQuery(event.target.value)
    }

    return(
        <div style={{padding:'0 10px', height:'50vh'}}>
            {
                hackerInfo === null ?
            
            <div style={{marginTop:'20vh', textAlign:'center'}}>
                <input placeholder="Enter Hacker Address" type="text" onChange={handleSearchInput} style= {{width:'70%', height:'5vh', textAlign:'center'}}>
                </input>
                <div style={{marginTop:'2vh'}}>
                <button onClick={()=>{

                    if (query.length !== 42){
                        alert('Enter a Valid Lukso Address')
                        return;
                    } else {
                        fetchProfile(query).then((profileData) =>{    

                            if(profileData[1].value === null ||profileData[1].value === undefined) {
                                alert('No Hacker Data Found')
                            } else {
                                console.log('hackerchain data found')
                                setHackerInfo(profileData[1].value.LSP3Profile.keys[0].provider[0])
                                setUPInfo(profileData[0].value)
                            }
                            // get registered hacker keys 
                            //setHackerChain(profileData[1].value)
                        })
                    }
                    
                }}> search</button>
                </div>
               
            </div>
            :
            <div style={{textAlign:'center', marginTop:'20vh', color:'white'}}>
                
            <p> Hacker Found: </p>
            <p> {query} </p> 
            <p> Registered Keys: </p> 

            { 
                
                providers.map(arg=>{
                    if(hackerInfo.includes(arg)){
                      return <button style={{margin:'10px 10px'}} onClick={()=>setInfoModal(arg)}> {logos[arg]} </button>
                    }
                  })
            }
            { //  diaplay provider info 
                infoModal === '' ? 
                null
                :
                <div style={{height:'30vh', border:'1px solid white', color:'white'}}>
                    <div style={{textAlign:'left', margin:'10px 10px'}}>
                    <button style={{backgroundColor:'black', border:'0px', color:'white'}} onClick={()=>setInfoModal('')}>x</button> 
                    <div style={{textAlign:'center'}}>
                    <p> Authentication Info </p>
                    </div>
                    {
                        getAuthInfo(infoModal)
                    }
                    </div>
                </div>
                
            }
            {
                upInfo.LSP3Profile.name === '' || upInfo.LSP3Profile.description === '' ? 
                <div style={{marginBottom:'10vh'}}>
                <p style={{color:'white'}}> No Available Universal Profile Metadata </p> 
                </div>
                :
                <div style={{marginBottom:'10vh'}}>
                    <p> Universal Profle Metadata </p> 
                    <p style={{color:'white'}}> {upInfo.name} </p>
                    <p style={{color:'white'}}> {upInfo.description} </p>
                </div>
            }
            </div>
            }
           
        </div>
    )
}