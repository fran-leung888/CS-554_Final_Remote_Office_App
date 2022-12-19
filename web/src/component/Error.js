import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/esm/Button";

export default function Error() {
  return (
    <div>
      <Alert key="danger" variant="danger">
        Something Wrong! Please try again!
      </Alert>

      <div>
        <Button
          style={{
            border: "30px",
            backgroundImage:
              "linear-gradient( 135deg, #FFA6B7 10%, #1E2AD2 100%)",
          }}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
