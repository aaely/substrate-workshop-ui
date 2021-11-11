import { MutableRefObject, useRef, useState } from 'react'
import { Avatar } from '@mui/material';
import { cart as c } from '../Recoil/cart';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {FaCannabis, FaDollarSign, FaShoppingCart} from 'react-icons/fa'
import {SiMoleculer, SiParitysubstrate} from 'react-icons/si'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { currentView, navToggle } from '../Recoil/router'
import { get_pol_acct, get_pol_accts, pol_api_dev } from '../Recoil/recoil';
import IconButton from '@mui/material/IconButton';
import { useClickOutside } from '../hooks/useClickOutside'
import { balance, user as u } from '../Recoil/balanceListener';
import { blockNumber, finalizedBlockNumber } from '../Recoil/blockListener';
import Identicon from '@polkadot/react-identicon'

type Anchor = 'left';

export default function Nav() {
  const [vis, setVis] = useRecoilState(navToggle);
  const setView = useSetRecoilState(currentView)
  const acct = useRecoilValue(get_pol_acct)
  const allAccounts = useRecoilValue(get_pol_accts)
  const bal = useRecoilValue(balance)
  const bn = useRecoilValue(blockNumber)
  const fbn = useRecoilValue(finalizedBlockNumber)
  const cart = useRecoilValue(c)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const user: any = useRecoilValue(u)
  const api = useRecoilValue(pol_api_dev)

  const navRef: MutableRefObject<any> = useRef()

  useClickOutside(navRef, () => handleVis())

  const handleVis = () => {
    if(vis) {
      setVis(false)
      return
    }
    return
  }

  const sendAllAlice = async () => {
    try {
      const unsub: any = await api?.tx['balances']['transferAll'](acct, true).signAndSend(allAccounts[0], (result: any) => {
        console.log(`Current status is ${result.status}, recipient is ${acct}`);
    
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
        } else if (result.status.isFinalized) {
          console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
          unsub()
        }
      })
    } catch(error) {
      console.log(error)
    }
  }

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setVis(true);
    };

  const handleUserHover = () => {
    setShowUserInfo(!showUserInfo)
  }

  const userInfo = () => {
    return(
      <div onMouseLeave={() => setShowUserInfo(false)}>
      {[{text: `Orders: ${user?.totalOrders}`, func: () => setView('orders')},]
          .map((item, index) => (
            <ListItem onClick={item.func} key={index} button>
              <ListItemText primary={item.text} />
            </ListItem>
      ))}
      </div>
    )
  }

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setVis(false)}
      onKeyDown={() => setVis(false)}
    >
      <List>
        <ListItem button onClick={() => setView('account')} onMouseOver={() => setShowUserInfo(true)}>
          <Avatar alt='profile picture' src={`https://ipfs.io/ipfs/${user?.profileImage}`}/>
          <ListItemText sx={{textAlign: 'center'}} primary={`@${user?.handle}`}/>
        </ListItem>
        {showUserInfo && userInfo()}
        <Divider/>
        <ListItem button onClick={() => setView('landing')}>
          <ListItemIcon>
              <SiParitysubstrate/>
          </ListItemIcon>
          <ListItemText primary='Home'/>
        </ListItem>
        <Divider/>
        {[{text: 'Peptide Builder', icon: <SiMoleculer/>, func: () => setView('peptideBuilder')},
          {text: 'Amino Builder', icon: <SiMoleculer/>, func: () => setView('aminoBuilder')},
          {text: 'Products', icon: <SiMoleculer/>, func: () => setView('products')},
          {text: 'User Registration', icon: <SiMoleculer/>, func: () => setView('userRegistration')},]
          .map((item, index) => (
          <ListItem button onClick={item.func} key={index}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      <Divider/>
        {[{text: 'Cannabinoid Builder', icon: <FaCannabis/>, func: () => setView('cannBuilder')}, 
          {text: 'Terpene Builder', icon: <FaCannabis/>, func: () => setView('terpBuilder')}, 
          {text: 'Cannabis Product Builder', icon: <FaCannabis/>, func: () => setView('cannabisProductBuilder')}]
          .map((item, index) => (
          <ListItem button onClick={item.func} key={index}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      <Divider/>
            <ListItem button onClick={() => sendAllAlice()} >
              <ListItemIcon>
                <FaDollarSign/>
              </ListItemIcon>
              <ListItemText primary='Fund My Wallet'/>
            </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <div style={{display: 'flex', 
                   position: 'fixed', 
                   justifyContent: 'space-around', 
                   alignContent: 'center', 
                   alignItems:'center', 
                   justifyItems: 'center',
                   width: '100vw',
                   height: '7vh',
                   backgroundColor: '#333', 
                   color: 'limegreen',
                   flexWrap: 'wrap'}}
                   >
        <IconButton ref={navRef} onClick={() => setVis(true)} style={{backgroundColor: 'white'}}>
          <SiParitysubstrate/>
        </IconButton>
        <div>
          Current Block: {bn}
        </div>
        <div>
          Last Finalized Block: {fbn}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Identicon
            value={acct}
            size={32}
            theme={'polkadot'}
          />{'\u00A0'}{acct}
        </div>
        <div>
          <FaDollarSign/>{bal?.free}
        </div>
        <div>
          <Badge color='primary' badgeContent={cart.length}>
            <IconButton onClick={() => setView('checkout')}>
            <FaShoppingCart/>
            </IconButton>
          </Badge>
        </div>
      </div>
          <Drawer
            anchor={'left'}
            open={vis}
            onClose={toggleDrawer('left', true)}
          >
            {list('left')}
          </Drawer>
    </div>
  );
}