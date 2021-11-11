import { PacmanLoader } from 'react-spinners';
import { Box } from 'gestalt';
import "gestalt/dist/gestalt.css";

const PacMan: Function = () => {
    return (
    <Box
    position="fixed"
    dangerouslySetInlineStyle={{
        __style: {
            bottom: '70%',
            left: '44%',
            transform: "translateX(-50%)",

        }
    }}
    >
    <PacmanLoader 
    color="yellow"
    size = {50}
    />
    </Box>
    );
}

export default PacMan;