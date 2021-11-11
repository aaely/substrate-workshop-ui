import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Card, 
         CardHeader,
         CardMedia,
         CardContent,
         CardActions,
         Collapse,
         IconButton,
         Typography,
        } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {BsCartPlusFill} from 'react-icons/bs'

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

export default function RecipeReviewCard(props) {
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
      <Card onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} sx={{ maxWidth: 345, boxShadow: boxShadow, marginTop: '1vh', marginBottom: '1vh'}}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.peptide[0].name}
        />
        <CardMedia
          component="img"
          height="194"
          image={`https://ipfs.io/ipfs/${props.peptide[0].imageHash}`}
          alt={`${props.peptide[0].name}`}
          sx={{
            backgroundSize: 'contain'
          }}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Price: ${props.peptide[0].price / 100}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={() => props.addProduct(props.peptide[0])}>
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
              Production Theoretical Yield: {props.peptide[1].productionYield}%
            </Typography>
            <Typography paragraph>
              Amino Chain: <br/>
              {props.peptide[1].chain.map((amino, i) => {
                return(
                  <span key={i}>-{amino.name}-</span>
                )
              })}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }