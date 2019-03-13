import React from "react";

export default WrappedComponent => {
    class HOC extends React.Component {
        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    theAoDappId={
                        "95e91d8954922300c26b09064a8722b691acdfbb914faf61bcd1e59f5ecbac0a"
                    }
                />
            );
        }
    }
    return HOC;
};
