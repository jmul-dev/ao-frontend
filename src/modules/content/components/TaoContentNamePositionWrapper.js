import { Component } from "react";
import PropTypes from "prop-types";
import withNameTaoPosition from "../containers/withNameTaoPosition";
import { compose } from "react-apollo";
import withUserIdentifiers from "../../account/containers/withUserIdentifiers";
import withTaoContentState from "../containers/withTaoContentState";

/**
 * Component will only render its children if the
 * current user happens to be in a position wrt the
 * tao content in question.
 */
class TaoContentNamePositionWrapper extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        children: PropTypes.func.isRequired,
        // withUserIdentifiers
        ethAddress: PropTypes.string,
        aoName: PropTypes.shape({
            nameId: PropTypes.string
            // (omitting additional fields)
        }),
        // withNameTaoPosition
        nameTaoPosition: PropTypes.shape({
            advocateName: PropTypes.string,
            listenerName: PropTypes.string,
            speakerName: PropTypes.string
        }),
        getNameTaoPosition: PropTypes.func.isRequired,
        // withTaoContentState
        taoContentState: PropTypes.string,
        getTaoContentState: PropTypes.func.isRequired
    };
    componentDidMount() {
        if (!this.props.nameTaoPosition && this.props.content.taoId) {
            this.props.getNameTaoPosition(this.props.content.taoId);
            this.props.getTaoContentState(this.props.content.id);
        }
    }
    render() {
        const {
            content,
            nameTaoPosition,
            aoName,
            taoContentState
        } = this.props;
        if (!content.taoId || !nameTaoPosition || !aoName) return null;
        const userIsInPosition =
            aoName.name === nameTaoPosition.advocateName ||
            aoName.name === nameTaoPosition.speakerName ||
            aoName.name === nameTaoPosition.listenerName;
        return this.props.children({
            nameTaoPosition,
            userIsInPosition,
            contentVerified: taoContentState === "Accepted to TAO"
        });
    }
}

export default compose(
    withUserIdentifiers,
    withNameTaoPosition,
    withTaoContentState
)(TaoContentNamePositionWrapper);
