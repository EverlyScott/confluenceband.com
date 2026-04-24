"use client";

import { LocalizationProvider as MuiLocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const LocalizationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterMoment}>
      {children}
    </MuiLocalizationProvider>
  );
};

export default LocalizationProvider;
