import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import {
  getGridDateOperators,
  GRID_DATE_COL_DEF,
  GridColTypeDef,
  GridFilterInputValueProps,
  GridRenderEditCellParams,
  useGridApiContext,
} from "@mui/x-data-grid";
import { DateTimePicker, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";

const dateColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getGridDateOperators(false).map((item) => ({
    ...item,
    InputComponent: GridFilterDateInput,
    InputComponentProps: { showTime: false },
  })),
  valueFormatter: (value) => {
    if (value) {
      return dayjs(value).format("DD/MM/YYYY");
    }
    return "";
  },
};

function GridEditDateCell({
  id,
  field,
  value,
  colDef,
  hasFocus,
}: GridRenderEditCellParams<any, Date | null, string>) {
  const apiRef = useGridApiContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const Component = colDef.type === "dateTime" ? DateTimePicker : DatePicker;

  const handleChange = (newValue: dayjs.Dayjs | null) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue?.toISOString() || null,
    });
  };

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current!.focus();
    }
  }, [hasFocus]);

  return (
    <Component
      value={value ? dayjs(value) : null}
      autoFocus
      onChange={handleChange}
      slotProps={{
        textField: {
          inputRef,
          variant: "standard",
          fullWidth: true,
          sx: {
            padding: "0 6px",
            justifyContent: "center",
            fontSize: "inherit",
            "& .MuiSvgIcon-root": {
              fontSize: "16px", // Smaller icon
            },
          },
          InputProps: {
            disableUnderline: true,
            sx: { fontSize: "inherit" },
          },
        },
      }}
    />
  );
}

function GridFilterDateInput(
  props: GridFilterInputValueProps & { showTime?: boolean }
) {
  const { item, showTime, applyValue, apiRef } = props;

  const Component = showTime ? DateTimePicker : DatePicker;

  const handleFilterChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Component
      value={item.value ? dayjs(item.value) : null}
      autoFocus
      label={apiRef.current.getLocaleText("filterPanelInputLabel")}
      slotProps={{
        textField: {
          variant: "standard",
        },
        inputAdornment: {
          sx: {
            "& .MuiButtonBase-root": {
              marginRight: -1,
            },
          },
        },
      }}
      onChange={handleFilterChange}
    />
  );
}

export default dateColumnType;
