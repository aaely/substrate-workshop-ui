import Circles from './Loaders/Circles'
import Rings from './Loaders/Rings'
import PacMan from './Loaders/PacMan'
import MyBarLoader from './Loaders/MyBarLoader'

interface Type {
    type: string
}

const Loader: Function = (props: Type) => {
    switch(props.type) {
        case 'rings': {
            return <Rings />
        }
        case 'circles': {
            return <Circles />
        }
        case 'pacman': {
            return <PacMan />
        }
        case 'barloader': {
            return <MyBarLoader />
        }
        default: {
            break;
        }
    }
}

export default Loader;