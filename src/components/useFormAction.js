"use client";
import { startTransition, useActionState } from "react";

// Like useActionState, but submits via onSubmit so React does not clear the form afterwards
// (React 19 resets forms bound with action={...}, which wipes the user's input when we return an error).
export function useFormAction(serverAction) {
  const [state, dispatch, pending] = useActionState(serverAction, null);
  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => dispatch(data));
  };
  return [state, onSubmit, pending];
}
