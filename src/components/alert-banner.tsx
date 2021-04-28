import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { bodyWidth } from '../index';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
        alert: {
            borderRadius: bodyWidth > 768 ? '0.6rem' : 0,
            boxShadow: 'inset 0 -3px 5px rgba(0,0,0,.1)',
        }
    }),
);

type AlertBannerProps = {
    openAlert: boolean,
    handleOpenAlert(open: boolean): void
}

export const AlertBanner: React.FC<AlertBannerProps> = (props) => {
    const classes = useStyles();
    const { openAlert, handleOpenAlert } = props;

    return (
        <div className={classes.root}>
            <Collapse in={openAlert}>
                <Alert
                    className={classes.alert}
                    severity="info"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                handleOpenAlert(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                >
                    There are no favorites here yet :( Go ahead and star some fantastic repos that get
                    you inspired or an awesome new project to contribute to.
                </Alert>
            </Collapse>
        </div>
    );
};
