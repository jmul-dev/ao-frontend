import React, { PureComponent } from "react";
import View from "../View";
import { compose } from "react-apollo";
import { userContentQuery } from "../../modules/video/containers/withUserContent";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { ContentFieldsWithFragments } from "../../graphql/fragments/ContentFields";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import CloseIcon from "@material-ui/icons/Close";
import { AO_CONSTANTS } from "ao-library";

class PdfContentView extends PureComponent {
    static propTypes = {
        // react-router
        match: PropTypes.shape({
            params: PropTypes.shape({
                contentId: PropTypes.string.isRequired
            })
        }),
        history: PropTypes.any,
        // withContentQuery
        userContentQuery: PropTypes.shape({
            loading: PropTypes.bool.isRequired,
            error: PropTypes.error,
            userContent: PropTypes.any
        })
    };
    _onClose = () => {
        this.props.history.goBack();
    };
    render() {
        const { classes } = this.props;
        const { contentId } = this.props.match.params;
        const { loading, error, userContent } = this.props.userContentQuery;
        return (
            <View className={"PdfContentView"} padding="none">
                <section style={{ height: "100%", width: "100%" }}>
                    <div className={classes.statusBar}>
                        <ButtonBase
                            title={`Close Dapp`}
                            className={classes.closeButton}
                            onClick={this._onClose}
                        >
                            <CloseIcon />
                        </ButtonBase>
                    </div>
                    <div className={classes.dappWindowContainer}>
                        {userContent && (
                            <embed
                                src={`${process.env.REACT_APP_AO_CORE_URL}/${
                                    userContent.fileUrl
                                }`}
                                width="100%"
                                height="100%"
                                type="application/pdf"
                            />
                        )}
                    </div>
                </section>
            </View>
        );
    }
}

const styles = ({ palette }) => ({
    statusBar: {
        height: 40,
        backgroundColor: palette.secondary.main,
        color: "white",
        display: "flex",
        alignItems: "center"
    },
    closeButton: {
        height: 40,
        width: 40,
        marginRight: 8
    },
    dappWindowContainer: {
        height: `calc(100% - 40px)`,
        overflow: "auto"
    }
});

const dappContentQuery = gql(`
    query userContent($id: ID!) {
        userContent(id: $id) {
            ${ContentFieldsWithFragments}
        }
    }
`);

const withContentQuery = graphql(dappContentQuery, {
    name: "userContentQuery",
    options: ({
        match: {
            params: { contentId }
        }
    }) => ({
        variables: { id: contentId },
        fetchPolicy: "cache-and-network"
    })
});

export default compose(
    withStyles(styles, { withTheme: true }),
    withContentQuery
)(PdfContentView);
