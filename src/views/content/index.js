import React from "react";
import { Switch, Route } from "react-router";
import DappContentView from "./DappContentView";
import PdfContentView from "./PdfContentView";

// TODO: make a more generic ContentView component that wraps the content query and app bar
export default () => (
    <Switch>
        <Route
            path="/app/view/content/dapp/:contentId"
            component={DappContentView}
        />
        <Route
            path="/app/view/content/pdf/:contentId"
            component={PdfContentView}
        />
    </Switch>
);
