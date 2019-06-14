import { connect } from "react-redux";
import { getNameTaoPosition } from "../../account/reducers/account.reducer";

const mapDispatchToProps = {
    getNameTaoPosition
};

const mapStateToProps = (state, props) => ({
    nameTaoPosition: state.account.nameTaoPosition[props.content.taoId]
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
);
