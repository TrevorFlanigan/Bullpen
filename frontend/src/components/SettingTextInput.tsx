import React, { ChangeEvent, Component } from "react";
import { TextField } from "@material-ui/core";
interface ISettingTextInputProps {
  icon: any;
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

interface ISettingTextInputState {}

export default class SettingTextInput extends React.Component<
  ISettingTextInputProps,
  ISettingTextInputState
> {
  public render() {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
          }}
        >
          <this.props.icon />
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            placeItems: "center",
          }}
        >
          <TextField
            label={this.props.label}
            value={this.props.value}
            onChange={this.props.onChange}
          />
        </div>
      </div>
    );
  }
}
