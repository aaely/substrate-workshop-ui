import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Card, 
         CardHeader,
         CardMedia,
         CardContent,
         CardActions,
         Collapse,
         Avatar,
         IconButton,
         Typography,
        } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {BsShare} from 'react-icons/bs'
import {AiOutlineLike} from 'react-icons/ai'
import Deck from './Deck'

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



export default function MuiCardPosts(props) {
    const [expanded, setExpanded] = useState(false);
    console.log(props.post.images)
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

    console.log(props.user?.profile_image)

    const displaySingleImage = () => {
      return(
        <CardMedia
        component="img"
        height="194"
        image={`https://ipfs.io/ipfs/${props.post?.images[0]}`}
        alt="img"
        />
      )
    }
  
    return (
      <Card 
      onMouseOver={handleMouseOver} 
      onMouseLeave={handleMouseLeave} 
      sx={{ 
        maxHeight: '40vh',
        maxWidth: '40vw',
        boxShadow: boxShadow, 
        marginTop: '1vh', 
        marginBottom: '1vh',
        overflowX: 'hidden',
      }}
      >
        <CardHeader
          avatar={
            <Avatar src={`https://ipfs.io/ipfs/${props.user?.profile_image}`} />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.user?.handle}
          subheader={props.post?.date}
        />
          {props.post?.images?.length === 1 ? displaySingleImage() : <Deck images={props.post?.images}/>}
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            ${props.post?.content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={() => props.like()}>
            <AiOutlineLike/>
          </IconButton>
          <IconButton onClick={() => props.like()}>
            <BsShare/>
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
              Comments:
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }