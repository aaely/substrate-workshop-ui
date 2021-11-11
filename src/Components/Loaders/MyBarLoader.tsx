import { BarLoader } from 'react-spinners';
import { Box } from 'gestalt';
import "gestalt/dist/gestalt.css";


const MyBarLoader = () => {
    return (
    <Box
    position="fixed"
    dangerouslySetInlineStyle={{
        __style: {
            bottom: 300,
            left: '45%',
            transform: "translateX(-50%)",

        }
    }}
    >
    <BarLoader 
    color="green"
    />
    </Box>
    );
}

export default MyBarLoader;