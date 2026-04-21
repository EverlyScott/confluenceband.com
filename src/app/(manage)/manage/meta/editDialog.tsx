"use client";

import type { ConfluenceMeta } from "@/db";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import type React from "react";
import InstrumentSort from "./instrumentSort";

interface IProps {
  data?: ConfluenceMeta;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditDialog: React.FC<IProps> = ({ data, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <TextField label="ID" value={data?.id} disabled variant="filled" />
        <RenderContent data={data} />
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;

interface RenderContentProps {
  data?: ConfluenceMeta;
}

const RenderContent: React.FC<RenderContentProps> = ({ data }) => {
  if (data?.id === "instrumentsort") {
    return <InstrumentSort data={data} />;
  } else return <TextField value={data?.content} />;
};
