import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import "../styles/overview-aside.css";
import {
    TokenBalance,
    fromBaseToHighestDenomination
} from "../../../utils/denominations";
import FolderIcon from "@material-ui/icons/Folder";
import {
    contentNameFromFileInputs,
    contentSize
} from "../reducers/upload.reducer";

const OverviewAside = ({ form, includePricing = false }) => {
    const { amount, denomination } = fromBaseToHighestDenomination(
        contentSize(form.content)
    );
    return (
        <aside className="OverviewAside">
            <Paper style={{ overflow: "hidden", marginBottom: 16 }}>
                <ContentPreview {...form} />
            </Paper>
            <Typography variant="caption" component="ul">
                <li>
                    <span>{"license"}</span>
                    <span className="divider" />
                    <b>{`${form.contentLicense}`}</b>
                </li>
                <li>
                    <span>{"file size"}</span>
                    <span className="divider" />
                    <b>{`${amount.toFixed(1)} ${
                        denomination.fileSizeSuffix
                    }`}</b>
                </li>
                <li style={{ marginBottom: 24 }}>
                    <span>{"min stake req."}</span>
                    <span className="divider" />
                    <b>{`${amount.toFixed(1)} ${denomination.prefix} AO`}</b>
                </li>
                {includePricing ? (
                    <React.Fragment>
                        <li>
                            <span>{"your stake"}</span>
                            <span className="divider" />
                            <b className="em-submit">
                                <TokenBalance
                                    baseAmount={form.stake}
                                    decimals={1}
                                    includeAO={true}
                                />
                            </b>
                        </li>
                        <li>
                            <span>{"you charge"}</span>
                            <span className="divider" />
                            <b className="em-submit">
                                <TokenBalance
                                    baseAmount={form.stake}
                                    decimals={1}
                                    includeAO={true}
                                />
                                {` / view`}
                            </b>
                        </li>
                        <li>
                            <span>{"you make"}</span>
                            <span className="divider" />
                            <b className="em-submit">{`${
                                form.profitSplitPercentage
                            }% profits`}</b>
                        </li>
                    </React.Fragment>
                ) : null}
            </Typography>
        </aside>
    );
};
export default OverviewAside;

const ContentPreview = ({ contentType, content }) => {
    switch (contentType) {
        case "VOD":
            return (
                <div
                    className="content-preview"
                    style={{ backgroundImage: `url(${content.preview})` }}
                >
                    <video src={content.preview} />
                </div>
            );
        case "DAPP":
        case "PDF":
        default:
            return (
                <div className="content-preview">
                    <div
                        className="content-preview-overlay"
                        style={{ color: "white" }}
                    >
                        <FolderIcon style={{ marginBottom: 6, fontSize: 32 }} />
                        <Typography
                            variant="caption"
                            align="center"
                        >{`${contentNameFromFileInputs(content)}`}</Typography>
                    </div>
                </div>
            );
    }
};
