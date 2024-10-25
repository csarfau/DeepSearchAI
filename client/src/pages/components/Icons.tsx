import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import ShareIcon from '@mui/icons-material/Share';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import HeadsetIcon from '@mui/icons-material/Headset';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import PaletteIcon from '@mui/icons-material/Palette';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

export const iconsPath = {
    technology : <Diversity2Icon  sx={{color: '#572288f', width: '1rem'}}/>,
    trip : <ConnectingAirportsIcon  sx={{color: '#572288f', width: '1rem'}}/>,
    programming : <ShareIcon  sx={{color: '#572288f', width: '1rem'}}/>,
    cooking: <LocalDiningIcon  sx={{color: '#572288f', width: '1rem'}}/>,
    art: <PaletteIcon  sx={{color: '#572288f', width: '1rem'}}/>,
    politics : <AssuredWorkloadIcon  sx={{color: '#572288f', width: '1rem'}}/>,
    sport : <SportsHandballIcon  sx={{color: '#572288f', width: '1rem'}}/>,
    history : <LocalLibraryIcon  sx={{color: '#572288f', width: '1rem'}}/>,
    music: <HeadsetIcon sx={{color: '#572288f', width: '1rem'}}/>,
} as const;