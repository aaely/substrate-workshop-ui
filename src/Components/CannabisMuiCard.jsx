import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {BsCartPlusFill} from 'react-icons/bs'
import 
        getCannabinoidName
 from '../utils/getCannabinoidName'
import { useRecoilValue } from 'recoil';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

export default function CannabisMuiCard(props) {
    const [expanded, setExpanded] = useState(false);

    const [boxShadow, setBoxShadow] = useState('0px 3px 10px -2px rgba(0, 0, 0, 0.4)')
    const handleMouseOver = () => {
      setBoxShadow('0px 6px 20px -5px rgba(0, 0, 0, 0.4)')
    }
    const handleMouseLeave = () => {
      setBoxShadow('0px 3px 10px -2px rgba(0, 0, 0, 0.4)') 
    }
  
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
  
    return (
      <Card 
      onMouseOver={handleMouseOver} 
      onMouseLeave={handleMouseLeave} 
      sx={{ 
        maxWidth: 345, 
        boxShadow: boxShadow, 
        marginTop: '1vh', 
        marginBottom: '1vh'
      }}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.cannabis.name}
        />
        <CardMedia
          component="img"
          height="194"
          image={`https://ipfs.io/ipfs/${props.cannabis.imageHash}`}
          alt={`${props.cannabis.name}`}
          sx={{
            backgroundSize: 'contain'
          }}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {props.cannabis.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${props.cannabis.price/100}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={() => props.addProduct(props.cannabis)}>
            <BsCartPlusFill/>
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              Cannabinoids: <br/>
                <ul>
              {props.cannabis.cannabinoids.map((cannabinoid, i) => {
                return(
                  <li key={i}>{cannabinoid[1]} {cannabinoid[2]}%</li>
                )
              })}
                </ul>
            </Typography>
            <Typography>
              Terpenes: <br/>
                <ul>
              {props.cannabis.terpenes.map((terpene, i) => {
                return(
                  <li key={i}>{terpene[1]} {terpene[2]}%</li>
                )
              })}
                </ul>
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }