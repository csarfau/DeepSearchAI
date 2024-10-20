import { Box, Skeleton, SxProps, Theme, Typography, useTheme } from "@mui/material";
import { iconsPath } from "../components/Icons";

export const SkeletonThemeCard: React.FC = () => {
    const theme = useTheme();
    
    const skeletonStyles: SxProps<Theme> = {
        border: theme.borders.primary,
        borderRadius: theme.borderRadius.medium,
        px: 1,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        position: 'relative',
    };

    return (
        <Box sx={skeletonStyles}>
            <Skeleton variant="circular" width={24} height={24} sx={{mb: '5.5px'}} />
            <Skeleton variant="text" width="4rem" height="1rem" />
        </Box>
    );
};

interface IOptionThemeCard {
    label: keyof typeof iconsPath;
    variant: 'outlined' | 'contained';
    onClick: () => void;
    isSelected: boolean
}

export const OptionThemeCard:React.FC<IOptionThemeCard> = ({
    label,
    onClick,
    isSelected = false
}) => {
    const theme = useTheme();

    const baseStyles:SxProps<Theme> = {
        border: theme.borders.primary, 
        borderRadius: theme.borderRadius.medium, 
        boxSizing: 'border-box',
        px: 1,
        py: 4, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px',
        margin: 'none', 
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s',
        ":hover": {
            boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
        },
        ...(isSelected && {
                transform: 'scale(1.05)',
                background: theme.palette.primary.main,
                color: isSelected ? theme.palette.secondary.main : theme.palette.primary.main
            }
        ) 
    }; 

    return (
        <Box  sx={{ ...baseStyles }} onClick={ onClick }>
            <img style={{
                width: '1.5rem',
                filter: isSelected ? 
                    'invert(0%)'
                    : 
                    'brightness(0) saturate(100%) invert(13%) sepia(75%) saturate(5186%) hue-rotate(271deg) brightness(89%) contrast(105%)' 
                }} src={iconsPath[label]} alt={`icon ${label}`} />
            <Typography variant='body2'>{label}</Typography>
        </Box>
    )
}