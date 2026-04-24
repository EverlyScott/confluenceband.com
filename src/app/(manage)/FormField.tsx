/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { RecordModel } from "pocketbase";
import { type RefOption, type Column } from "./columns";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  type InputProps,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import OpenInNew from "@mui/icons-material/OpenInNew";

interface IProps<T extends RecordModel | undefined> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  column: Column;
}

export default function FormField<T extends RecordModel | undefined>({
  data,
  setData,
  column,
}: IProps<T>): ReactNode {
  if (column.editingType === undefined) {
    switch (column.type) {
      case "string":
        return <StringField {...{ data, setData, column }} />;
      case "dateTime":
        return <DateField {...{ data, setData, column }} />;
      case "boolean":
        return <BooleanField {...{ data, setData, column }} />;
      case "number":
        return <NumberField {...{ data, setData, column }} />;
    }
  } else {
    switch (column.editingType) {
      case "ref":
        return <RefField {...{ data, setData, column }} />;
    }
  }
}

const generateAdornments = (column: Column, show = true): InputProps => {
  if (!show) return {};

  return {
    startAdornment: column.startAdornment ? (
      <InputAdornment position="start">{column.startAdornment}</InputAdornment>
    ) : undefined,
    endAdornment: column.endAdornment ? (
      <InputAdornment position="end">{column.endAdornment}</InputAdornment>
    ) : undefined,
  };
};

function StringField<T extends RecordModel | undefined>({
  data,
  setData,
  column,
}: IProps<T>): ReactNode {
  return (
    <TextField
      label={column.headerName}
      value={data?.[column.field] ?? ""}
      multiline={column.multiline}
      disabled={column.disabled}
      slotProps={{
        input: generateAdornments(column, !!data?.[column.field]),
      }}
      onChange={(evt) => {
        setData((oldData) => {
          return {
            ...oldData,
            [column.field]: evt.target.value,
          };
        });
      }}
    />
  );
}

function DateField<T extends RecordModel | undefined>({
  data,
  setData,
  column,
}: IProps<T>): ReactNode {
  return (
    <DateTimePicker
      label={column.headerName}
      value={moment.utc(data?.[column.field] ?? "").local()}
      disabled={column.disabled}
      slotProps={{
        textField: {
          slotProps: {
            input: {
              sx: { backgroundColor: "#1A1724" },
            },
          },
        },
      }}
      onChange={(value) => {
        setData((oldData) => {
          if (!value) return oldData;

          return {
            ...oldData,
            [column.field]: value.toISOString(),
          };
        });
      }}
    />
  );
}

function BooleanField<T extends RecordModel | undefined>({
  data,
  setData,
  column,
}: IProps<T>): ReactNode {
  return (
    <TextField
      select
      label={column.headerName}
      value={data?.[column.field] ?? "true"}
      disabled={column.disabled}
      slotProps={{
        input: generateAdornments(column, !!data?.[column.field]),
      }}
      onChange={(evt) =>
        setData({
          ...data,
          [column.field]: evt.target.value === "true",
        })
      }
    >
      <MenuItem value="true">True</MenuItem>
      <MenuItem value="false">False</MenuItem>
    </TextField>
  );
}

function NumberField<T extends RecordModel | undefined>({
  data,
  setData,
  column,
}: IProps<T>): ReactNode {
  return (
    <TextField
      type="number"
      label={column.headerName}
      value={(data?.[column.field] ?? NaN).toString()}
      disabled={column.disabled}
      slotProps={{
        input: generateAdornments(column, !!data?.[column.field]),
      }}
      onChange={(evt: ChangeEvent<HTMLInputElement>) => {
        setData((oldData) => {
          return {
            ...oldData,
            [column.field]: evt.target.valueAsNumber,
          };
        });
      }}
    />
  );
}

function RefField<T extends RecordModel | undefined>({
  data,
  setData,
  column,
}: IProps<T>): ReactNode {
  const [refOptions, setRefOptions] = useState<RefOption[]>([]);

  useEffect(() => {
    (async () => {
      if (column.fetchRefOptions === undefined)
        throw new Error("Type of ref without any ref options!");

      setRefOptions(await column.fetchRefOptions());
    })();
  }, [column]);

  return (
    <TextField
      select
      label={column.headerName}
      value={data?.[column.field] ?? ""}
      disabled={column.disabled}
      slotProps={{
        input: {
          ...generateAdornments(column, !!data?.[column.field]),
          endAdornment: (
            <Tooltip title="View Item">
              <IconButton
                sx={{ marginRight: "1rem" }}
                onClick={() => alert("TBD")}
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
          ),
        },
      }}
      onChange={(evt) => {
        setData({
          ...data,
          [column.field]: evt.target.value,
        });
      }}
    >
      {refOptions.map((ref) => {
        return (
          <MenuItem value={ref.id} key={ref.id}>
            {ref.name}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
