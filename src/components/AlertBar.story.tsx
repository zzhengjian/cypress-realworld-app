import React, { useState, useEffect } from 'react';
import { interpret } from "xstate";
import AlertBar from './AlertBar';
import { Severities, snackbarMachine } from "../machines/snackbarMachine";

// Define the shape of the plain JavaScript object you expect
export interface AlertBarState {
  type: 'SHOW'|'HIDE';
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

interface AlertBarWrapperProps {
    payload: AlertBarState;
}

const AlertBarWrapper: React.FC<AlertBarWrapperProps> = ({ payload }) => {
    let snackbarService = interpret(snackbarMachine);
    snackbarService.start();
    snackbarService.send(payload);
  return <AlertBar snackbarService={snackbarService} />;
};

export default AlertBarWrapper;
