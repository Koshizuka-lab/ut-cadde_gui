import { GroupBase, StylesConfig } from "react-select";

export const selectStyles: StylesConfig<{
  value: string;
  label: string | undefined;
}, false, GroupBase<{
  value: string;
  label: string;
}>> | undefined = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "white",
    borderColor: state.isDisabled ? "#E0E0E0" : "#00479D",
    borderRadius: "0",
    cursor: "pointer",
  }),
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? "#00479D" : "white",
    color: state.isSelected ? "white" : "#00479D",
    borderTop: "1px solid #E0E0E0",
    "&:hover": {
      backgroundColor: "rgba(0, 71, 157, 0.1)",
      color: "#00479D",
      cursor: "pointer",
    }
  })
}