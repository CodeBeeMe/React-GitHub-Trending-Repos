import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: 10,
            paddingLeft: 10,
            borderLeft: '1px solid #c1c1c1',
            color: '#0fa7ff',
        },
        formControlLabel: {
            margin: 0,
            '& > *': {
                fontSize: 16,
                color: 'inherit',
            },
        },
    }),
);


type ControlledCheckboxProps = {
    label: string,
    favorites: Array<number>,
    filterByStarred(): void,
    resetRepos(): void,
    handleOpenAlert(open: boolean): void,
}

export const ControlledCheckbox: React.FC<ControlledCheckboxProps> = (props) => {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);
    const { label, favorites, filterByStarred, resetRepos, handleOpenAlert } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (favorites.length !== 0) {
            setChecked(event.target.checked);
        } else {
            handleOpenAlert(true);
            // alert('You have no favorites yet!');
        }
        event.target.checked ? filterByStarred() : resetRepos();
    };

    return (
        <FormGroup row className={classes.root}>
            <FormControlLabel
                title="View starred repositories"
                className={classes.formControlLabel}
                control={
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        name="checked"
                        color="default"
                        icon={<i className="far fa-star"/>}
                        checkedIcon={<i className="fas fa-star"/>}
                    />
                }
                label={label}
            />
        </FormGroup>
    );
};
