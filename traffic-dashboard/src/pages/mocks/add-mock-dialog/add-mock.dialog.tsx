import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { createMock } from "../../../api/api";
import { SnifferSelector } from "../../../components/sniffer-selector/sniffer-selector";
import styles from "./add-mock-dialog.module.scss";

type AddMockDialogProps = { open: boolean; close: () => void };

export const AddMockDialog: React.FC<AddMockDialogProps> = ({
  open,
  close,
}) => {
  const [port, setPort] = useState<number>();
  const [method, setMethod] = useState<string>("GET");
  const [endpoint, setEndpoint] = useState<string>("");
  const [status, setStatus] = useState<number>(200);
  const [data, setData] = useState<unknown>("{ }");
  const [isLoading, setIsLoading] = useState<boolean>();

  const handleAddMock = () => {
    if (!port) {
      return;
    }
    setIsLoading(true);
    createMock(port, method, endpoint, status, data)
      .then(() => {
        close();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={close}>
      <Card className={styles.card}>
        <Typography>Add mock</Typography>
        <SnifferSelector
          onChange={(value) => setPort(+value)}
          selectedSnifferPort={`${port}`}
        />
        <TextField
          label="Method"
          placeholder="GET"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
        <TextField
          label="Endpoint"
          placeholder="/example"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <TextField
          label="Status"
          placeholder="1234"
          type="number"
          value={status}
          onChange={(e) => setStatus(+e.target.value)}
        />
        <TextField
          label="Data"
          placeholder="{}"
          multiline
          rows={5}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <Button onClick={handleAddMock}>
          {isLoading === true ? <CircularProgress /> : <>add</>}
        </Button>
        <Button color="error" onClick={close}>
          cancel
        </Button>
      </Card>
    </Dialog>
  );
};
