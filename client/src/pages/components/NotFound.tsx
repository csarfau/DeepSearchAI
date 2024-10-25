import { Alert,  AlertTitle,  Box } from '@mui/material';
import failIcon from '@/assets/icons/fail-icon.svg';
import { theme } from '../../App';

interface ErrorAlertProps {
    message: string;
}

const NotFound: React.FC<ErrorAlertProps> = ({ message  }) => {
    

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'end',
                mt: '2rem', 
            }}
        >
            <Alert
                severity="info"
                icon={<img style={{ width: '2rem' }} src={failIcon} />}
                sx={{
                    padding: '2rem',
                    maxWidth: '30rem',
                    fontSize: '1rem',
                    background: theme.palette.secondary.main
                }}
            >
                <AlertTitle sx={{fontWeight: 'bold'}}>Not Found</AlertTitle>
                {message}
            </Alert>
        </Box>
    );
};

export default NotFound;