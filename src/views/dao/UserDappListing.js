import React from "react";
import DappListItem from "./DappListItem";
import { withStyles } from "@material-ui/core/styles";

const UserDappListing = ({ classes, dapps }) => {
    return (
        <ul className={classes.ul}>
            {dapps.map(content => {
                return (
                    <li className={classes.li} key={content.id}>
                        <DappListItem content={content} />
                    </li>
                );
            })}
        </ul>
    );
};

const styles = () => ({
    ul: {
        margin: 0,
        padding: 0,
        listStyle: "none"
    },
    li: {}
});

export default withStyles(styles)(UserDappListing);
