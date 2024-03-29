import { connect } from "react-redux";

// Redux
const mapStateToProps = store => {
    let lotCreations = Object.values(store.ico.lotCreations).sort((a, b) => {
        if (a.blockNumber > b.blockNumber) return -1;
        if (a.blockNumber < b.blockNumber) return 1;
        // block numbers are equal, sort by multiplier
        if (a.multiplier > b.multiplier) return 1;
        if (a.multiplier < b.multiplier) return -1;
        return 0;
    });
    return {
        lotCreations
    };
};

export default connect(
    mapStateToProps
);
