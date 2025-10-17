import "./Login.css";
import { Form, Input, Button } from "@heroui/react";
import React, { useState } from "react";

export default function Login() {
  const [action, setAction] = useState(null);
  return (
    <>
      <div className="login_wrapper">
        <div>
          <h1>Login</h1>
          <Form
            className="w-full max-w-xs flex flex-col gap-4"
            onReset={() => setAction("reset")}
            onSubmit={(e) => {
              e.preventDefault();
              let data = Object.fromEntries(new FormData(e.currentTarget));

              setAction(`submit ${JSON.stringify(data)}`);
            }}
          >
            <Input
              isRequired
              errorMessage="Please enter a valid username"
              label="Username"
              labelPlacement="outside"
              name="username"
              placeholder="Enter your username"
              type="text"
            />

            <Input
              isRequired
              errorMessage="Please enter a valid email"
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
            />
            <div className="flex gap-2">
              <Button color="primary" type="submit">
                Submit
              </Button>
              <Button type="reset" variant="flat">
                Reset
              </Button>
            </div>
            {action && (
              <div className="text-small text-default-500">
                Action: <code>{action}</code>
              </div>
            )}
          </Form>
        </div>
      </div>
    </>
  );
}
