import {useEffect, useState} from 'react'
import { ERC725 } from '@erc725/erc725.js';
import { LSPFactory } from '@lukso/lsp-factory.js';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import Web3 from 'web3'
import { useSession, signIn, signOut } from "next-auth/react"
import {  BsGithub, BsTwitter, BsFacebook, BsGoogle} from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

// Authentication Flow:
// - user picks key
// - taken to provider site to verify (handled by NextAuth.js)
// - redirected back to hackerchain where user can login 
// - once logged in if session is present (successful authentication) then transaction starts to set hackerchain

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
  
export default function Register(){

  const { data: session } = useSession()
  const [hackerChain, setHackerChain] = useState([])
  const [account, setAccount] = useState('')
  const [web3, setWeb3] = useState('')
  const [modal, setModal] = useState(false)

  useEffect(()=>{
    setWeb3(window.ethereum)
  },[])

  function checkSession(usr, chain){

      if(session){

        if(chain === undefined || chain === null) {
          setProfileData(usr, [session.connectedProvider, session.loggedInfo])
        } else {
            if(chain.includes(session.connectedProvider) === false){
              let newChain = chain.concat([session.connectedProvider, session.loggedInfo])
              setProfileData(usr, newChain)
            } else {
              alert('key already detected for this account, cancelling session . . . ')
              signOut()
            }
        }
      }
  }

  const handleUP = async() => {
    try {

      let accounts = [];
      accounts = await web3.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])
      // check Universal Profile
      let chain = await fetchProfile(accounts[0]).then((profileData) =>{
        console.log(profileData)
        // check HackerChain
        if(profileData[1].value !== null){
          
          setHackerChain(profileData[1].value.LSP3Profile.keys[0].provider[0])
          return profileData[1].value.LSP3Profile.keys[0].provider[0]
        }
      })

      checkSession(accounts[0], chain)

    } catch(e) {
      console.log(e)
      if(window.ethereum === undefined){
        console.log("UP Extension Not Detected")
      } 
    }
  }

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
      // if metamask or wrong address is being used
      alert('Invalid Lukso Extension or Profile Detected')
      setAccount('')
    }
  }

  async function setProfileData(user, toAdd){

  const web3JS = new Web3('https://rpc.l16.lukso.network');

    const jsonFile = {
        "HackerChain": {
          "keys": [
            {
               provider:[toAdd],
            }
          ]
        }
    }

    const lspFactory = new LSPFactory(window.ethereum, {
        chainId: 2828, // L16 Public Testnet
    });

    // Step 2 - Upload our formInfo object to IPFS
    const uploadResult = await lspFactory.UniversalProfile.uploadProfileData(jsonFile.HackerChain);
    const hackerchainIPFSUrl = uploadResult.url;

    // Step 3.1 - Setup erc725.js
    const schema = [
        {
            "name": "HackerChain",
            "key": "0x848fdbef8fd8e0facfb5417e82d1232b553e547d7f74b3e968fde9e287e76baf",
            "keyType": "Singleton",
            "valueContent": "JSONURL", 
            "valueType": "bytes"
        }
    ];

    const erc725 = new ERC725(schema, user, web3JS.currentProvider,{
        ipfsGateway: 'https://2eff.lukso.dev/ipfs/',
    });

    // Step 3.2 - Encode the LSP3Profile data (to be written on our UP)
    const encodedData = erc725.encodeData([{
        keyName: '0x848fdbef8fd8e0facfb5417e82d1232b553e547d7f74b3e968fde9e287e76baf',
        value: {
            hashFunction: 'keccak256(utf8)',
            // hash our LSP3 metadata JSON file
            hash: Web3.utils.keccak256(JSON.stringify(uploadResult.json)),
            url: hackerchainIPFSUrl,
        },
    }]);

    // create UP contract instance 
    const universalProfileContract = new web3JS.eth.Contract(
        UniversalProfile.abi,
        account,
    );

    // configure data to upload to Universal Profile

    // encode the setData method payload
    const abiPayload = await universalProfileContract.methods[
        'setData(bytes32[],bytes[])'
    ](encodedData.keys, encodedData.values).encodeABI();

    const tx = {
        from: user,
        to: user,
        gas: '0x76c0',
        gasPrice: '0x9184e72a000',
        data: abiPayload
    }

    await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
       })
       
  }

    return(
        <div style={{padding:'0 10px', height:'50vh'}}>
           
            {
                account === '' ?
                <div style={{marginTop:'25vh', textAlign:'center', color:'white'}}>
                <button onClick={handleUP} style={{cursor:'pointer'}}> Connect Lukso Account </button>
                <div style={{marginTop:'20vh', fontSize:'10px'}}>
                <p> Link for UP Browser Extension (required to register) </p>
                <a href="https://docs.lukso.tech/guides/browser-extension/install-browser-extension/" target="_blank">
                  https://docs.lukso.tech/guides/browser-extension/install-browser-extension/
                </a>
                
                </div>
                </div>
                :
                <div style={{marginTop:'20vh',  textAlign:'center', color:'white'}}>
                    <p> Account: </p>
                    <p>{account}</p> 
                    { /* Display Keys */
                      hackerChain.length === 0 ?
                      <div style={{marginBottom:'8vh', marginTop:'8vh'}}>
                      <p> No Registered Keys </p>
                      </div>
                      :
                      <>
                      <div>
                      Registered Keys:
                      </div>
                      <div style={{marginTop:'2vh', marginBottom:'5vh'}}>
                      {
                        providers.map(arg=>{
                          if(hackerChain.includes(arg)){
                            return <button style={{margin:'10px 10px'}} > {logos[arg]} </button>
                          }
                        })
                      }
                      </div>
                      </>
                    } 
                   
                    { /* Key Options   */
                      modal === false ?
                      <button style={{cursor:'pointer'}} onClick={()=>setModal(true)}> + Add Key </button>
                      :
                      <div>
                        <div style={{ marginBottom:'5vh'}}>
                          <p> Select New Key to Register </p>
                        </div>
                        <div style={{ width:'30%', marginLeft:'auto', marginRight:'auto'}}>
                            <button onClick={()=>setModal(false)} style={{backgroundColor:'black', color:'white', border:'0px', marginRight:'1vw'}}>x</button> 
                            { 
                              providers.map(arg=>{
                                
                                if(!hackerChain.includes(arg)){
                                  return <button style={{cursor:'pointer', margin:'10px 10px'}} onClick={()=>signIn(arg)}> {logos[arg]} </button>
                                }
                                 
                              })
                            }
                        </div>
                      </div>
                    }
                </div>
            }
        </div>
    )
}


