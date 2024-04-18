import { interpret } from "xstate";
import { test, expect } from "@playwright/experimental-ct-react";
import AlertBarWrapper from "./AlertBar.story";
import { AlertBarState } from "./AlertBar.story";
import { Severities, snackbarMachine } from "../machines/snackbarMachine";
import React from "react";

test.describe("Alert Bar with state", () => {
  const SeverityValues = Object.values(Severities);
  let snackbarService;
  //add jest before each
  test.beforeEach(() => {
    snackbarService = interpret(snackbarMachine);
    snackbarService.start();
    expect(snackbarService.state.value).toBe("invisible");
  });

  SeverityValues.forEach((severity) => {
    test(`Alert Bar shows ${severity} message`, async ({ mount }) => {
      let payload: AlertBarState = {
        type: "SHOW",
        severity: severity,
        message: "Test Message",
      };
      snackbarService.send(payload);
      expect(snackbarService.state.value).toBe("visible");

      const component = await mount(<AlertBarWrapper payload={payload} />);
      await expect(component).toContainText(payload.message);
    });
  });
});
